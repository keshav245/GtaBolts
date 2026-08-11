import { createClient } from '@/lib/supabase/server';

export interface SiteSettings {
  contactEmail: string | null;
  discordUrl: string | null;
  twitterUrl: string | null;
  telegramUrl: string | null;
  instagramUrl: string | null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('contact_email, discord_url, twitter_url, telegram_url, instagram_url')
    .eq('id', 1)
    .maybeSingle();

  return {
    contactEmail: data?.contact_email ?? null,
    discordUrl: data?.discord_url ?? null,
    twitterUrl: data?.twitter_url ?? null,
    telegramUrl: data?.telegram_url ?? null,
    instagramUrl: data?.instagram_url ?? null,
  };
}
