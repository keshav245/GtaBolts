import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

const CATEGORIES = [
  { slug: 'gta-v', name: 'GTA V', count: 240 },
  { slug: 'gta-online', name: 'GTA Online', count: 180 },
  { slug: 'vice-city', name: 'Vice City', count: 64 },
  { slug: 'san-andreas', name: 'San Andreas', count: 97 },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <h2 className="font-display font-bold text-2xl md:text-3xl mb-8">Browse by category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}>
            <GlassCard reticle className="p-6 h-full flex flex-col justify-between min-h-[140px]">
              <h3 className="font-display font-semibold text-lg">{cat.name}</h3>
              <p className="font-mono text-xs text-cyan mt-2">{cat.count} mods</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
