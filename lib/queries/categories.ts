import { createClient } from '@/lib/supabase/server';
import { getScreenshotUrl } from '@/lib/r2';

export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
}

export async function getCategories(): Promise<CategoryRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('id, slug, name, image_key').order('name');
  if (!data) return [];

  return Promise.all(
    data.map(async (c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      imageUrl: c.image_key ? await getScreenshotUrl(c.image_key) : null,
    }))
  );
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('id, slug, name, image_key').eq('slug', slug).maybeSingle();
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    imageUrl: data.image_key ? await getScreenshotUrl(data.image_key) : null,
  };
}
