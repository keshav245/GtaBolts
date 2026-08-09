-- ============================================================
-- GtaMods: employee purchase visibility
-- Run this in Supabase SQL Editor AFTER 0001_init.sql and 0002_purchases_update_policy.sql.
--
-- Without this, an employee's /dashboard can see their own mods (already
-- allowed) but not who bought them or for how much, since the existing
-- purchases policies only let a user see purchases where they were the
-- buyer, or an owner see everything. This lets an employee see purchase
-- rows for mods THEY uploaded — needed for the sales/revenue stat cards.
-- ============================================================

create policy "Employees can view purchases of their own mods" on public.purchases
  for select using (
    exists (
      select 1 from public.mods
      where mods.id = purchases.mod_id
      and mods.uploader_id = auth.uid()
    )
  );

-- The dashboard's "delete draft" action needs this — employees could always
-- view/update their own mods, but never had permission to delete any mod at
-- all (only owners could, via moderation). Scoped to drafts only, so a
-- published (and possibly already-purchased) mod can never be deleted this way.
create policy "Employees can delete own draft mods" on public.mods
  for delete using (auth.uid() = uploader_id and status = 'draft');
