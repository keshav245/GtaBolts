import BrowseClient from '@/components/browse/BrowseClient';
import { getPublishedMods } from '@/lib/queries/mods';
import { getCategories } from '@/lib/queries/categories';

interface BrowsePageProps {
  searchParams: { q?: string };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const [mods, categories] = await Promise.all([getPublishedMods(), getCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Full catalog</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl">Browse mods</h1>
      </div>

      <BrowseClient mods={mods} categories={categories} initialSearch={searchParams.q ?? ''} />
    </div>
  );
}
