'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth-guards';

export async function addToCart(modSlug: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: mod } = await supabase
    .from('mods')
    .select('id')
    .eq('slug', modSlug)
    .eq('status', 'published')
    .maybeSingle();

  if (!mod) return { ok: false, message: 'Mod not found.' };

  const { data: existingPurchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('mod_id', mod.id)
    .eq('status', 'completed')
    .maybeSingle();

  if (existingPurchase) return { ok: false, message: "You already own this mod — check your library." };

  const { error } = await supabase.from('cart_items').upsert(
    { user_id: user.id, mod_id: mod.id },
    { onConflict: 'user_id,mod_id', ignoreDuplicates: true }
  );

  if (error) return { ok: false, message: error.message };

  revalidatePath('/cart');
  return { ok: true, message: 'Added to cart.' };
}

export async function removeFromCart(modId: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id).eq('mod_id', modId);

  if (error) return { ok: false, message: error.message };

  revalidatePath('/cart');
  return { ok: true, message: 'Removed from cart.' };
}
