import { notFound } from 'next/navigation';
import Link from 'next/link';
import MediaGallery from '@/components/mod/MediaGallery';
import PurchasePanel from '@/components/mod/PurchasePanel';
import { getPublishedModBySlug } from '@/lib/queries/mods';

interface ModPageProps {
  params: { slug: string };
}

export default async function ModDetailPage({ params }: ModPageProps) {
  const mod = await getPublishedModBySlug(params.slug);
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
            <p className="text-fog leading-relaxed">{mod.description || 'No description provided yet.'}</p>
          </div>
        </div>

        <PurchasePanel mod={mod} />
      </div>
    </div>
  );
}
