-- The Inner Garden — initial schema.
-- Run in Supabase → SQL Editor, or `supabase db push`.
--
-- THE TWO LOAD-BEARING RULES
--   1. A person is never "a user with a partner_id". Household state lives in
--      memberships + membership_seats, so separation, billing transfer, death,
--      and leave-and-return are row changes rather than schema surgery.
--   2. No per-person private table carries membership_id. `notes` has no path
--      to a household, so one seat physically cannot reach the other's notes.
--      The privacy promise is enforced by shape, not by remembering a WHERE.

create extension if not exists "citext";

-- ── Types ────────────────────────────────────────────────────────────────────
do $$ begin
  create type tier as enum ('free','bloom');
  create type membership_status as enum ('trialing','active','past_due','canceled','incomplete');
  create type seat_role as enum ('owner','partner');
  create type seat_status as enum ('invited','active','left','removed');
  create type entitlement_status as enum ('active','grace','none');
  create type membership_origin as enum ('self','gift','comp','founding');
exception when duplicate_object then null; end $$;

-- ── profiles ─────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text,
  season text,                        -- private, self-declared, never shown to the other seat
  comms_prefs jsonb default '{"letters":true,"product":true}'::jsonb,
  platform_role text not null default 'member' check (platform_role in ('member','staff')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── memberships (the household + the billing entity) ─────────────────────────
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  tier tier not null default 'bloom',
  status membership_status not null default 'incomplete',
  billing_owner_id uuid references profiles(id) on delete set null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,   -- UNIQUE is what makes webhook and
  current_period_end timestamptz,       -- return-URL provisioning converge on
  cancel_at_period_end boolean not null default false,  -- one row instead of racing
  grace_until timestamptz,
  seat_limit smallint not null default 2,
  origin membership_origin not null default 'self',
  founding_price_lookup_key text,
  created_at timestamptz not null default now()
);

-- ── membership_seats (THE COUPLE SEAT) ───────────────────────────────────────
create table if not exists membership_seats (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,   -- null while invited
  role seat_role not null,
  status seat_status not null default 'invited',
  invited_email citext,
  invite_token_hash text,
  invite_expires_at timestamptz,
  joined_at timestamptz,
  left_at timestamptz
);

-- One person holds at most ONE active seat anywhere. This quiet constraint is
-- what makes entitlement unambiguous and closes the seat-collecting exploit.
create unique index if not exists seat_one_active_per_user
  on membership_seats (user_id) where (status = 'active' and user_id is not null);
create unique index if not exists seat_unique_member_user
  on membership_seats (membership_id, user_id) where (user_id is not null);
create index if not exists seat_by_membership on membership_seats (membership_id);

-- ── entitlements (materialized access; service-role write only) ──────────────
create table if not exists entitlements (
  user_id uuid primary key references profiles(id) on delete cascade,
  membership_id uuid references memberships(id) on delete set null,
  tier tier not null default 'free',
  status entitlement_status not null default 'none',
  seat_role seat_role,
  valid_until timestamptz,
  updated_at timestamptz not null default now()
);

-- ── notes (NO membership_id, deliberately) ───────────────────────────────────
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  context_type text not null default 'general' check (context_type in ('film','guide','general')),
  context_ref text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists notes_by_user on notes (user_id, updated_at desc);

-- ── progress + saved ─────────────────────────────────────────────────────────
create table if not exists video_progress (
  user_id uuid not null references profiles(id) on delete cascade,
  video_slug text not null,
  seconds integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, video_slug)
);

create table if not exists saved_items (
  user_id uuid not null references profiles(id) on delete cascade,
  item_type text not null check (item_type in ('film','guide','article')),
  item_ref text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_type, item_ref)
);

-- ── founding list (pre-launch capture; the thing that was being discarded) ───
create table if not exists founding_list (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  source text,
  confirm_token_hash text,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── stripe webhook idempotency ───────────────────────────────────────────────
create table if not exists stripe_events (
  id text primary key,                -- Stripe event id
  type text not null,
  processed_at timestamptz not null default now()
);

-- ── legal acceptances ────────────────────────────────────────────────────────
create table if not exists legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  document text not null,             -- 'terms' | 'privacy'
  version text not null,
  accepted_at timestamptz not null default now()
);

-- ═══ ROW LEVEL SECURITY ══════════════════════════════════════════════════════
-- FORCE, so even the table owner is subject to policy.
alter table profiles           enable row level security;
alter table profiles           force row level security;
alter table memberships        enable row level security;
alter table memberships        force row level security;
alter table membership_seats   enable row level security;
alter table membership_seats   force row level security;
alter table entitlements       enable row level security;
alter table entitlements       force row level security;
alter table notes              enable row level security;
alter table notes              force row level security;
alter table video_progress     enable row level security;
alter table video_progress     force row level security;
alter table saved_items        enable row level security;
alter table saved_items        force row level security;
alter table founding_list      enable row level security;
alter table founding_list      force row level security;
alter table stripe_events      enable row level security;
alter table stripe_events      force row level security;
alter table legal_acceptances  enable row level security;
alter table legal_acceptances  force row level security;

-- Which membership does the current user actively hold a seat in?
create or replace function current_membership_id()
returns uuid language sql stable security definer set search_path = public as $$
  select membership_id from membership_seats
  where user_id = auth.uid() and status = 'active' limit 1
$$;

-- profiles: yourself only. The other seat never reads your profile row.
drop policy if exists profiles_self on profiles;
create policy profiles_self on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- memberships: any active seat may READ the household (to see billing state);
-- nobody may write from the client. All writes go through the service role.
drop policy if exists memberships_read on memberships;
create policy memberships_read on memberships
  for select using (id = current_membership_id());

-- seats: you may see the seats of your own household (so the owner can see the
-- partner exists, and the partner can see who owns billing). Writes: service role.
drop policy if exists seats_read on membership_seats;
create policy seats_read on membership_seats
  for select using (membership_id = current_membership_id());

-- entitlements: read your own. Written only by the service role.
drop policy if exists entitlements_self_read on entitlements;
create policy entitlements_self_read on entitlements
  for select using (user_id = auth.uid());

-- notes: THE CENTRAL PROMISE. Yourself, and no other path exists.
drop policy if exists notes_self on notes;
create policy notes_self on notes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists progress_self on video_progress;
create policy progress_self on video_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists saved_self on saved_items;
create policy saved_self on saved_items
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists legal_self on legal_acceptances;
create policy legal_self on legal_acceptances
  for select using (user_id = auth.uid());

-- founding_list and stripe_events: no client policy at all, so RLS denies
-- everything to anon/authenticated. Only the service role touches them.

-- ── new user → profile row ───────────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null))
  on conflict (id) do nothing;
  insert into public.entitlements (user_id, tier, status)
  values (new.id, 'free', 'none')
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();
