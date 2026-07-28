import { createClient } from '@/lib/supabase/server';
import { getScreenshotUrl } from '@/lib/r2';
import { CATEGORIES } from '@/lib/categories';
import type { Mod } from '@/components/mods/ModCard';

export { CATEGORIES };

interface DbMod {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  price_in_paise: number;
  version: string;
  screenshots: string[];
  views: number;
  created_at: string;
}

// No reviews/ratings table exists yet, so rating is always 0 for now — the
// stars in the UI are a placeholder until a reviews feature gets built.
async function toModCard(supabase: Awaited<ReturnType<typeof createClient>>, row: DbMod): Promise<Mod> {
  const { count } = await supabase
    .from('purchases')
    .select('id', { count: 'exact', head: true })
    .eq('mod_id', row.id)
    .eq('status', 'completed');

  const thumbnailUrl = row.screenshots[0] ? await getScreenshotUrl(row.screenshots[0]) : '/placeholder-mod.jpg';

  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    thumbnailUrl,
    priceInPaise: row.price_in_paise,
    downloads: count ?? 0,
    rating: 0,
    version: row.version,
  };
}

export async function getPublishedMods(): Promise<Mod[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('mods')
    .select('id, slug, title, description, category, price_in_paise, version, screenshots, views, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (!data) return [];
  return Promise.all(data.map((row) => toModCard(supabase, row as DbMod)));
}

export async function getPublishedModsByCategory(categoryName: string): Promise<Mod[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('mods')
    .select('id, slug, title, description, category, price_in_paise, version, screenshots, views, created_at')
    .eq('status', 'published')
    .eq('category', categoryName)
    .order('created_at', { ascending: false });

  if (!data) return [];
  return Promise.all(data.map((row) => toModCard(supabase, row as DbMod)));
}

export interface ModDetailResult extends Mod {
  description: string;
  screenshots: string[];
  views: number;
}

export async function getPublishedModBySlug(slug: string): Promise<ModDetailResult | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('mods')
    .select('id, slug, title, description, category, price_in_paise, version, screenshots, views, created_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!data) return null;

  const row = data as DbMod;
  const modCard = await toModCard(supabase, row);
  const screenshotUrls = row.screenshots.length
    ? await Promise.all(row.screenshots.map(getScreenshotUrl))
    : ['/placeholder-mod.jpg'];

  return {
    ...modCard,
    description: row.description ?? '',
    screenshots: screenshotUrls,
    views: row.views,
  };
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase.from('mods').select('category').eq('status', 'published');
  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  });
  return counts;
}
