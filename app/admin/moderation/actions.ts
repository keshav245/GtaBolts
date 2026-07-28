'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';

export async function approveMod(slug: string) {
  await requireRole('owner');
  const supabase = await createClient();
  const { error } = await supabase.from('mods').update({ status: 'published' }).eq('slug', slug);
  if (error) return { ok: false, message: error.message };
  revalidatePath('/admin/moderation');
  return { ok: true, message: 'Mod approved and published.' };
}

export async function unpublishMod(slug: string) {
  await requireRole('owner');
  const supabase = await createClient();
  const { error } = await supabase.from('mods').update({ status: 'unpublished' }).eq('slug', slug);
  if (error) return { ok: false, message: error.message };
  revalidatePath('/admin/moderation');
  return { ok: true, message: 'Mod unpublished.' };
}

export async function deleteModAsOwner(slug: string) {
  await requireRole('owner');
  const supabase = await createClient();
  const { error } = await supabase.from('mods').delete().eq('slug', slug);
  if (error) return { ok: false, message: error.message };
  revalidatePath('/admin/moderation');
  return { ok: true, message: 'Mod deleted from the platform.' };
}
