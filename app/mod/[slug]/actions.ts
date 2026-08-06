'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function submitRating(modSlug: string, rating: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: 'Sign in to rate this mod.' };
  }

  const { data: mod } = await supabase.from('mods').select('id').eq('slug', modSlug).single();
  if (!mod) {
    return { ok: false, message: 'Mod not found.' };
  }

  // RLS ("Purchasers can rate a mod they bought") enforces that this only
  // succeeds for a completed purchase — no need to re-check that here.
  const { error } = await supabase
    .from('mod_ratings')
    .upsert({ user_id: user.id, mod_id: mod.id, rating }, { onConflict: 'user_id,mod_id' });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/mod/${modSlug}`);
  return { ok: true, message: 'Thanks for rating!' };
}
