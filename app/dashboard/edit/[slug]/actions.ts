'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';

interface UpdateModInput {
  title: string;
  description: string;
  category: string;
  priceInPaise: number;
  screenshotKeys: string[];
}

export async function updateModDetails(slug: string, input: UpdateModInput) {
  await requireRole('employee');
  const supabase = await createClient();

  // RLS ("Employees can update own mods") enforces this only succeeds if the
  // mod actually belongs to the signed-in user — no extra ownership check needed.
  const { error } = await supabase
    .from('mods')
    .update({
      title: input.title,
      description: input.description,
      category: input.category,
      price_in_paise: input.priceInPaise,
      screenshots: input.screenshotKeys,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/mod/${slug}`);
  return { ok: true, message: 'Mod updated.' };
}
