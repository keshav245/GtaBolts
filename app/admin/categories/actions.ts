'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createCategory(name: string, imageKey: string | null) {
  await requireRole('owner');
  const supabase = await createClient();

  const slug = slugify(name);
  if (!slug) return { ok: false, message: 'Enter a valid category name.' };

  const { error } = await supabase.from('categories').insert({ name, slug, image_key: imageKey });

  if (error) {
    // Unique constraint violation reads oddly raw — give a clearer message.
    if (error.code === '23505') {
      return { ok: false, message: `A category named "${name}" already exists.` };
    }
    return { ok: false, message: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/browse');
  return { ok: true, message: `Category "${name}" created.` };
}

export async function deleteCategory(id: string, name: string) {
  await requireRole('owner');
  const supabase = await createClient();

  // Block deletion if any mod still references this category by name —
  // mods.category is plain text (not a foreign key), so this app-level check
  // is what actually prevents orphaned data, RLS can't enforce it directly.
  const { count } = await supabase.from('mods').select('id', { count: 'exact', head: true }).eq('category', name);

  if (count && count > 0) {
    return {
      ok: false,
      message: `Can't delete "${name}" — ${count} mod${count === 1 ? '' : 's'} still use this category.`,
    };
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { ok: false, message: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/browse');
  return { ok: true, message: `Category "${name}" deleted.` };
}
