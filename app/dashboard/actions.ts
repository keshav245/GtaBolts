'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';

export async function toggleModStatus(slug: string, currentStatus: string) {
  await requireRole('employee');
  const supabase = await createClient();

  const nextStatus = currentStatus === 'published' ? 'draft' : 'published';

  // RLS ("Employees can update own mods") enforces that this only succeeds
  // if the mod actually belongs to the signed-in user — no extra check needed.
  const { error } = await supabase.from('mods').update({ status: nextStatus }).eq('slug', slug);

  if (error) return { ok: false, message: error.message };

  revalidatePath('/dashboard');
  return { ok: true, message: `Mod is now ${nextStatus}.` };
}

export async function deleteDraftMod(slug: string) {
  await requireRole('employee');
  const supabase = await createClient();

  // RLS ("Employees can delete own draft mods") enforces both ownership and
  // draft-only — this can't be used to delete a published/purchased mod.
  const { error } = await supabase.from('mods').delete().eq('slug', slug).eq('status', 'draft');

  if (error) return { ok: false, message: error.message };

  revalidatePath('/dashboard');
  return { ok: true, message: 'Draft deleted.' };
}
