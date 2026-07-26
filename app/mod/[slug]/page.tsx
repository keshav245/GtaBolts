import { notFound } from 'next/navigation';
import Link from 'next/link';
import MediaGallery from '@/components/mod/MediaGallery';
import PurchasePanel from '@/components/mod/PurchasePanel';
import Changelog from '@/components/mod/Changelog';
import { getAllMods, getModBySlug } from '@/lib/mods-data';

interface ModPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllMods().map((m) => ({ slug: m.slug }));
}

export default function ModDetailPage({ params }: ModPageProps) {
  const mod = getModBySlug(params.slug);
  if (!mod) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="mb-6">
        <Link
          href={`/category/${mod.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="font-mono text-xs uppercase tracking-wider text-violet-bright/70 hover:text-violet-bright transition-colors"
        >
          {mod.category}
        </Link>
        <h1 className="font-display font-bold text-3xl md:text-4xl mt-2">{mod.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-8">
          <MediaGallery screenshots={mod.screenshots} title={mod.title} />

          <div>
            <h2 className="font-display font-semibold text-xl mb-3">Description</h2>
            <p className="text-fog leading-relaxed">{mod.description}</p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl mb-3">Changelog</h2>
            <Changelog entries={mod.changelog} />
          </div>
        </div>

        <PurchasePanel mod={mod} />
      </div>
    </div>
  );
}
