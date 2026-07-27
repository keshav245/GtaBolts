'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';

interface CreateModInput {
  title: string;
  slug: string;
  description: string;
  category: string;
  priceInPaise: number;
  screenshotKeys: string[];
  modFileKey: string;
  status: 'draft' | 'published';
}

export async function createMod(input: CreateModInput) {
  const user = await requireRole('employee');
  const supabase = await createClient();

  const { error } = await supabase.from('mods').insert({
    slug: input.slug,
    title: input.title,
    description: input.description,
    category: input.category,
    price_in_paise: input.priceInPaise,
    screenshots: input.screenshotKeys,
    file_key: input.modFileKey,
    status: input.status,
    uploader_id: user.id,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath('/dashboard');
  return { ok: true, message: `${input.title} saved as ${input.status}.` };
}
