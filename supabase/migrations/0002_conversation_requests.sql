-- Conversation requests.
--
-- WHY THIS EXISTS: contact messages are deliberately never written to the
-- database, because someone describing a marriage in difficulty did not consent
-- to a permanent record of it. That rule is right and it stays. But it meant the
-- only route to booking a $150 session was an email that silently fails when
-- Resend is unconfigured, so every request for the actual revenue-earning
-- service was being dropped on the floor.
--
-- This table therefore holds LOGISTICS ONLY: who, how to reach them, which path,
-- whether they are coming alone, and when they are free. There is deliberately
-- no field for what they are going through. That conversation happens with
-- Dr. Laiyemo, not in a row.
--
-- Retention: `handled_at` is stamped when a request is closed out so old rows
-- can be pruned on a schedule rather than accumulating names forever.

create table if not exists conversation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null check (length(name) between 1 and 120),
  email text not null check (length(email) between 3 and 254),

  -- Which of the three published paths, or undecided.
  path text not null check (path in ('premarital', 'marital', 'rebuilding', 'unsure')),
  -- Coming together or beginning alone. The site promises both are welcome.
  attending text not null check (attending in ('together', 'alone')),

  -- Scheduling only. "Weekday evenings", not a description of their situation.
  availability text check (availability is null or length(availability) <= 400),
  timezone text check (timezone is null or length(timezone) <= 80),

  status text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'closed')),
  handled_at timestamptz
);

create index if not exists conversation_requests_open
  on conversation_requests (created_at desc)
  where (status <> 'closed');

alter table conversation_requests enable row level security;
alter table conversation_requests force row level security;

-- Staff check, mirroring current_membership_id()'s shape: SECURITY DEFINER so
-- the policy can read profiles without the caller needing rights on it.
create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and platform_role = 'staff' and deleted_at is null
  );
$$;

-- NOTE THE ABSENCE OF AN INSERT POLICY. That is the design, not an oversight.
-- A public "anyone may insert" policy on a form with no rate limiting is an
-- open spam funnel. Writes arrive only through the server action, which
-- validates first and uses the service role, so there is exactly one door and
-- it is one we control.
drop policy if exists requests_staff_read on conversation_requests;
create policy requests_staff_read on conversation_requests
  for select using (is_staff());

drop policy if exists requests_staff_update on conversation_requests;
create policy requests_staff_update on conversation_requests
  for update using (is_staff()) with check (is_staff());
