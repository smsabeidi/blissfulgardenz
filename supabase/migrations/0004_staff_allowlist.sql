-- Who gets the desk, decided before they arrive.
--
-- Until now the only route to staff was someone with the service role running
-- an UPDATE by hand. That makes a person a dependency: Dr. Laiyemo signs in at
-- an odd hour, sees "not your desk", and waits for a developer to flip a column.
--
-- An allowlist keyed on email fixes that. The signup trigger checks it, so the
-- role is decided by the address he signs in with rather than by whoever is
-- awake. Adding a colleague later is one INSERT, not a migration and a deploy.
--
-- WHY EMAIL IS SAFE AS THE KEY HERE: the only identity provider enabled is
-- Google, and Google verifies the address before it ever reaches Supabase. If a
-- password provider is turned on later, this becomes weaker — anyone able to
-- register an unverified address matching a row would be promoted — so the
-- trigger below requires the address to be confirmed.

create table if not exists staff_allowlist (
  email text primary key check (position('@' in email) > 1),
  note text,
  added_at timestamptz not null default now()
);

alter table staff_allowlist enable row level security;
alter table staff_allowlist force row level security;

-- No policies at all, deliberately. This table decides who holds power, so it
-- is reachable only through the service role and through the SECURITY DEFINER
-- trigger below. Not even staff may read it from the client: a desk that can
-- read the allowlist is one XSS away from a desk that can write it.

insert into staff_allowlist (email, note)
values ('admin@blissfulgardenz.com', 'Dr. Adeyinka (Musodiq) Laiyemo')
on conflict (email) do nothing;

-- Signup now assigns the role. Everything the previous version did is kept
-- exactly; only the platform_role is newly derived.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  role_for_user text := 'member';
begin
  -- Confirmed addresses only. An unconfirmed address is a claim, not an identity.
  if new.email is not null
     and new.email_confirmed_at is not null
     and exists (
       select 1 from public.staff_allowlist
       where lower(email) = lower(new.email)
     )
  then
    role_for_user := 'staff';
  end if;

  insert into public.profiles (id, display_name, platform_role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null), role_for_user)
  on conflict (id) do nothing;

  insert into public.entitlements (user_id, tier, status)
  values (new.id, 'free', 'none')
  on conflict (user_id) do nothing;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

-- Google confirms the address during the OAuth exchange, which for some flows
-- lands as an UPDATE to auth.users rather than the INSERT above. Without this
-- second trigger, an account created a moment before confirmation would keep
-- 'member' forever and we would be back to flipping columns by hand.
create or replace function handle_user_confirmed()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null
     and (old.email_confirmed_at is null or old.email is distinct from new.email)
     and exists (
       select 1 from public.staff_allowlist
       where lower(email) = lower(new.email)
     )
  then
    update public.profiles set platform_role = 'staff' where id = new.id;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after update on auth.users for each row execute function handle_user_confirmed();

-- Backfill: anyone already signed up with an allowlisted address.
update public.profiles p
   set platform_role = 'staff'
  from auth.users u
 where u.id = p.id
   and u.email_confirmed_at is not null
   and exists (select 1 from public.staff_allowlist s where lower(s.email) = lower(u.email))
   and p.platform_role <> 'staff';
