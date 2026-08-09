import { createClient } from '@/lib/supabase/server';
import { getScreenshotUrl } from '@/lib/r2';
import type { Mod } from '@/components/mods/ModCard';

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

// Batches purchase-count and rating lookups for a whole list of mods into
// two queries total, instead of two queries PER mod (the previous version
// ran 2N database round-trips for a page of N mods — this was the main
// cause of slow page loads on the homepage/browse/category pages).
async function toModCards(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: DbMod[]
): Promise<Mod[]> {
  if (rows.length === 0) return [];
  const modIds = rows.map((r) => r.id);

  const [{ data: purchases }, { data: ratings }] = await Promise.all([
    supabase.from('purchases').select('mod_id').eq('status', 'completed').in('mod_id', modIds),
    supabase.from('mod_ratings').select('mod_id, rating').in('mod_id', modIds),
  ]);

  return Promise.all(
    rows.map(async (row) => {
      const salesCount = (purchases ?? []).filter((p) => p.mod_id === row.id).length;
      const modRatings = (ratings ?? []).filter((r) => r.mod_id === row.id);
      const avgRating = modRatings.length > 0 ? modRatings.reduce((sum, r) => sum + r.rating, 0) / modRatings.length : 0;
      const thumbnailUrl = row.screenshots[0] ? await getScreenshotUrl(row.screenshots[0]) : '/placeholder-mod.jpg';

      return {
        slug: row.slug,
        title: row.title,
        category: row.category,
        thumbnailUrl,
        priceInPaise: row.price_in_paise,
        downloads: salesCount,
        rating: avgRating,
        version: row.version,
      };
    })
  );
}

export async function getPublishedMods(): Promise<Mod[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('mods')
    .select('id, slug, title, description, category, price_in_paise, version, screenshots, views, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return toModCards(supabase, (data ?? []) as DbMod[]);
}

export async function getPublishedModsByCategory(categoryName: string): Promise<Mod[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('mods')
    .select('id, slug, title, description, category, price_in_paise, version, screenshots, views, created_at')
    .eq('status', 'published')
    .eq('category', categoryName)
    .order('created_at', { ascending: false });

  return toModCards(supabase, (data ?? []) as DbMod[]);
}

export interface ModDetailResult extends Mod {
  description: string;
  screenshots: string[];
  views: number;
  ratingCount: number;
  currentUserCanRate: boolean;
  currentUserRating: number | null;
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

  // Awaited (not fire-and-forget) — in a serverless function, an unawaited
  // promise can get cancelled once the response is sent, so this could
  // silently never actually run otherwise. Wrapped in try/catch so a
  // failure here still can't break the page render.
  try {
    await supabase.rpc('increment_mod_views', { mod_slug: slug });
  } catch {
    // Non-critical — worst case the view count is off by one.
  }

  const [[modCard], screenshotUrls, { count: ratingCount }, { data: userResult }] = await Promise.all([
    toModCards(supabase, [row]),
    row.screenshots.length ? Promise.all(row.screenshots.map(getScreenshotUrl)) : Promise.resolve(['/placeholder-mod.jpg']),
    supabase.from('mod_ratings').select('id', { count: 'exact', head: true }).eq('mod_id', row.id),
    supabase.auth.getUser(),
  ]);

  const user = userResult.user;
  let currentUserCanRate = false;
  let currentUserRating: number | null = null;

  if (user) {
    const [{ data: existingRating }, { data: purchase }] = await Promise.all([
      supabase.from('mod_ratings').select('rating').eq('mod_id', row.id).eq('user_id', user.id).maybeSingle(),
      supabase
        .from('purchases')
        .select('id')
        .eq('mod_id', row.id)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .maybeSingle(),
    ]);
    currentUserRating = existingRating?.rating ?? null;
    currentUserCanRate = !!purchase;
  }

  return {
    ...modCard,
    description: row.description ?? '',
    screenshots: screenshotUrls,
    views: row.views + 1, // reflects the increment that just happened
    ratingCount: ratingCount ?? 0,
    currentUserCanRate,
    currentUserRating,
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
