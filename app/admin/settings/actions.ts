'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';

interface UpdateSettingsInput {
  contactEmail: string;
  discordUrl: string;
  twitterUrl: string;
}

export async function updateSiteSettings(input: UpdateSettingsInput) {
  await requireRole('owner');
  const supabase = await createClient();

  const { error } = await supabase
    .from('site_settings')
    .update({
      contact_email: input.contactEmail.trim() || null,
      discord_url: input.discordUrl.trim() || null,
      twitter_url: input.twitterUrl.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1);

  if (error) return { ok: false, message: error.message };

  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { ok: true, message: 'Contact info updated.' };
}
