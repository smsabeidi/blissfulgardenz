-- Let the desk read the subscriber list.
--
-- founding_list deliberately had no client policy at all, so RLS denied
-- everyone and only the service role could see it. That was right while nothing
-- rendered it; it is wrong now that Dr. Laiyemo is meant to send these people a
-- letter and has no way to see who they are.
--
-- SELECT only. Nobody edits a subscriber from the desk: unsubscribing is the
-- subscriber's own act, through their own link, and a staff UPDATE policy here
-- would let a mis-click quietly resubscribe someone who left.
drop policy if exists founding_staff_read on founding_list;
create policy founding_staff_read on founding_list
  for select using (is_staff());
