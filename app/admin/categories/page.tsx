import CategoryManager from '@/components/admin/CategoryManager';
import { getCategories } from '@/lib/queries/categories';
import { createClient } from '@/lib/supabase/server';

export default async function AdminCategoriesPage() {
  const [categories, supabase] = await Promise.all([getCategories(), createClient()]);
  const { data: mods } = await supabase.from('mods').select('category');

  const countByName: Record<string, number> = {};
  (mods ?? []).forEach((m) => {
    countByName[m.category] = (countByName[m.category] ?? 0) + 1;
  });

  const withCounts = categories.map((c) => ({ ...c, modCount: countByName[c.name] ?? 0 }));

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Taxonomy</p>
        <h1 className="font-display font-bold text-3xl">Categories</h1>
      </div>
      <CategoryManager initialCategories={withCounts} />
    </div>
  );
}
