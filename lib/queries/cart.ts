import { createClient } from '@/lib/supabase/server';
import { getScreenshotUrl } from '@/lib/r2';

export interface CartItem {
  modId: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  priceInPaise: number;
}

export async function getCartItems(): Promise<CartItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: cartRows } = await supabase.from('cart_items').select('mod_id').eq('user_id', user.id);
  if (!cartRows || cartRows.length === 0) return [];

  const modIds = cartRows.map((r) => r.mod_id);
  const { data: mods } = await supabase
    .from('mods')
    .select('id, slug, title, price_in_paise, screenshots, status')
    .in('id', modIds)
    .eq('status', 'published');

  if (!mods) return [];

  return Promise.all(
    mods.map(async (mod) => ({
      modId: mod.id,
      slug: mod.slug,
      title: mod.title,
      priceInPaise: mod.price_in_paise,
      thumbnailUrl: mod.screenshots[0] ? await getScreenshotUrl(mod.screenshots[0]) : '/placeholder-mod.jpg',
    }))
  );
}

export async function getCartCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from('cart_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return count ?? 0;
}
