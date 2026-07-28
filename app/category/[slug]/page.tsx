import Link from 'next/link';
import { notFound } from 'next/navigation';
import ModCard from '@/components/mods/ModCard';
import EmptyState from '@/components/ui/EmptyState';
import { CATEGORIES, getPublishedModsByCategory } from '@/lib/queries/mods';

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const mods = await getPublishedModsByCategory(category.name);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Category</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl">{category.name}</h1>
        <p className="font-mono text-xs text-fog-dim mt-2">{mods.length} mods</p>
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
