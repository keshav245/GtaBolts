import { createClient } from '@/lib/supabase/server';

export interface DashboardMod {
  slug: string;
  title: string;
  category: string;
  priceInPaise: number;
  status: string;
  views: number;
  sales: number;
  revenueInPaise: number;
  updatedAt: string;
}

export async function getMyMods(): Promise<DashboardMod[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // RLS ("Employees can view own mods") already scopes this to the signed-in
  // employee's own uploads — no explicit .eq('uploader_id', ...) needed, but
  // included anyway for clarity and as defense-in-depth.
  const { data: mods } = await supabase
    .from('mods')
    .select('id, slug, title, category, price_in_paise, status, views, updated_at')
    .eq('uploader_id', user.id)
    .order('updated_at', { ascending: false });

  if (!mods) return [];

  const { data: purchases } = await supabase
    .from('purchases')
    .select('mod_id, amount_in_paise')
    .eq('status', 'completed');

  return mods.map((mod) => {
    const modSales = (purchases ?? []).filter((p) => p.mod_id === mod.id);
    return {
      slug: mod.slug,
      title: mod.title,
      category: mod.category,
      priceInPaise: mod.price_in_paise,
      status: mod.status,
      views: mod.views,
      sales: modSales.length,
      revenueInPaise: modSales.reduce((sum, p) => sum + p.amount_in_paise, 0),
      updatedAt: mod.updated_at.slice(0, 10),
    };
  });
}

export function getSummary(mods: DashboardMod[]) {
  return {
    totalViews: mods.reduce((sum, m) => sum + m.views, 0),
    totalSales: mods.reduce((sum, m) => sum + m.sales, 0),
    totalRevenue: mods.reduce((sum, m) => sum + m.revenueInPaise, 0),
  };
}
