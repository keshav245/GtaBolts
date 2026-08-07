import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { CategoryRecord } from '@/lib/queries/categories';

interface CategoryGridProps {
  categories: CategoryRecord[];
  counts: Record<string, number>;
}

export default function CategoryGrid({ categories, counts }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <h2 className="font-display font-bold text-2xl md:text-3xl mb-8">Browse by category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}>
            <GlassCard reticle className="overflow-hidden h-full">
              <div className="relative aspect-video bg-black/40">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-fog-dim text-[11px] font-mono">
                    No photo yet
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-lg">{cat.name}</h3>
                <p className="font-mono text-xs text-cyan mt-1">{counts[cat.name] ?? 0} mods</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
