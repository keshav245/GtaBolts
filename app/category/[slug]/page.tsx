import Link from 'next/link';
import { notFound } from 'next/navigation';
import ModCard from '@/components/mods/ModCard';
import EmptyState from '@/components/ui/EmptyState';
import { getPublishedModsByCategory } from '@/lib/queries/mods';
import { getCategoryBySlug } from '@/lib/queries/categories';

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const mods = await getPublishedModsByCategory(category.name);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="mb-8 flex items-center gap-4">
        {category.imageUrl && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black/40">
            <img src={category.imageUrl} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        )}
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Category</p>
          <h1 className="font-display font-bold text-3xl md:text-4xl">{category.name}</h1>
          <p className="font-mono text-xs text-fog-dim mt-2">{mods.length} mods</p>
        </div>
      </div>

      {mods.length === 0 ? (
        <EmptyState
          title={`No ${category.name} mods yet`}
          description="This category is waiting on its first upload. Check back soon, or browse everything else in the meantime."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {mods.map((mod) => (
            <ModCard key={mod.slug} mod={mod} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link href="/browse" className="text-sm text-cyan hover:text-cyan-bright transition-colors">
          ← View full catalog
        </Link>
      </div>
    </div>
  );
}
