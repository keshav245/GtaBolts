-- ============================================================
-- GtaMods: purchases update policy
-- Run this in Supabase SQL Editor AFTER 0001_init.sql.
--
-- The order-creation endpoint upserts a 'pending' purchase row (attaching the
-- Razorpay order_id) using the signed-in user's own session — so it needs an
-- UPDATE policy, scoped to their own still-pending rows only. The pending ->
-- completed transition itself only ever happens via the webhook using the
-- service-role client, which bypasses RLS entirely, so this policy can't be
-- used to fake a completed purchase.
-- ============================================================

create policy "Users can update own pending purchase" on public.purchases
  for update using (auth.uid() = user_id and status = 'pending');
