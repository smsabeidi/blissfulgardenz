-- The internal desk: staff read access to the roster and the request queue.
--
-- WHAT STAFF MAY SEE, AND WHAT THEY MAY NEVER SEE.
--
-- Running a membership needs answers to "who has paid", "whose card failed",
-- "who is waiting to hear from us". It does not need, and must never have,
-- what a member wrote privately.
--
--   granted : profiles, entitlements, memberships, membership_seats,
--             conversation_requests   (roster, billing state, the queue)
--   refused : notes, video_progress, saved_items
--
-- notes is the load-bearing one. The product promises that a member's notes are
-- invisible even to the other seat on their own membership. A staff read policy
-- here would quietly turn that structural promise into a pinky swear, so there
-- is none, and adding one later should require re-reading this comment first.
--
-- These are additional SELECT policies. Postgres ORs permissive policies, so
-- the existing self-access rules are untouched: a member still sees their own
-- row through their own policy, and staff see the roster through this one.

alter table conversation_requests
  add column if not exists scheduled_for timestamptz;

alter table conversation_requests
  add column if not exists staff_note text
  check (staff_note is null or length(staff_note) <= 1000);

drop policy if exists profiles_staff_read on profiles;
create policy profiles_staff_read on profiles
  for select using (is_staff());

drop policy if exists entitlements_staff_read on entitlements;
create policy entitlements_staff_read on entitlements
  for select using (is_staff());

drop policy if exists memberships_staff_read on memberships;
create policy memberships_staff_read on memberships
  for select using (is_staff());

drop policy if exists seats_staff_read on membership_seats;
create policy seats_staff_read on membership_seats
  for select using (is_staff());
