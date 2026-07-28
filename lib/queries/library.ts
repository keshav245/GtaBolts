import { createClient } from '@/lib/supabase/server';
import { getScreenshotUrl } from '@/lib/r2';
import type { Mod } from '@/components/mods/ModCard';

export interface OwnedMod extends Mod {
  purchasedAt: string;
  timesDownloaded: number;
}

export async function getMyOwnedMods(): Promise<OwnedMod[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: purchases } = await supabase
    .from('purchases')
    .select('mod_id, created_at')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  if (!purchases || purchases.length === 0) return [];

  const modIds = purchases.map((p) => p.mod_id);
  const { data: mods } = await supabase
    .from('mods')
    .select('id, slug, title, category, price_in_paise, version, screenshots')
    .in('id', modIds);

  const { data: logs } = await supabase.from('download_logs').select('mod_id').eq('user_id', user.id);

  return Promise.all(
    (mods ?? []).map(async (mod) => {
      const purchase = purchases.find((p) => p.mod_id === mod.id)!;
      const timesDownloaded = (logs ?? []).filter((l) => l.mod_id === mod.id).length;
      const thumbnailUrl = mod.screenshots[0] ? await getScreenshotUrl(mod.screenshots[0]) : '/placeholder-mod.jpg';

      return {
        slug: mod.slug,
        title: mod.title,
        category: mod.category,
        thumbnailUrl,
        priceInPaise: mod.price_in_paise,
        downloads: 0,
        rating: 0,
        version: mod.version,
        purchasedAt: purchase.created_at.slice(0, 10),
        timesDownloaded,
      };
    })
  );
}

export interface DownloadLogEntry {
  modTitle: string;
  timestamp: string;
}

export async function getMyDownloadLog(): Promise<DownloadLogEntry[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: logs } = await supabase
    .from('download_logs')
    .select('mod_id, downloaded_at')
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false });

  if (!logs || logs.length === 0) return [];

  const modIds = [...new Set(logs.map((l) => l.mod_id))];
  const { data: mods } = await supabase.from('mods').select('id, title').in('id', modIds);
  const titleById = new Map((mods ?? []).map((m) => [m.id, m.title]));

  return logs.map((l) => ({
    modTitle: titleById.get(l.mod_id) ?? 'Unknown mod',
    timestamp: l.downloaded_at.slice(0, 16).replace('T', ' '),
  }));
}
