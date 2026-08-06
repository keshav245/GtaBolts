'use client';

import { useMemo, useState } from 'react';
import ModCard, { Mod } from '@/components/mods/ModCard';
import BrowseControls, { SortOption } from '@/components/browse/BrowseControls';
import EmptyState from '@/components/ui/EmptyState';

export default function BrowseClient({ mods: allMods }: { mods: Mod[] }) {
  // Real ceiling derived from actual mod prices (rounded up to the nearest
  // 100 for a clean slider max), instead of a hardcoded guess that could
  // silently hide any mod priced above it. Falls back to 1000 if there are
  // no mods yet, just so the slider has something reasonable to show.
  const priceCeiling = useMemo(() => {
    if (allMods.length === 0) return 1000;
    const highest = Math.max(...allMods.map((m) => m.priceInPaise / 100));
    return Math.ceil(highest / 100) * 100;
  }, [allMods]);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('popular');
  const [maxPrice, setMaxPrice] = useState(priceCeiling);

  const filtered = useMemo(() => {
    let result = allMods.filter((mod) => {
      const matchesSearch = mod.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === null || mod.category === activeCategory;
      const matchesPrice = mod.priceInPaise / 100 <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sort) {
      case 'popular':
        result = [...result].sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
        // allMods already arrives newest-first from the server query, so this
        // just preserves that order rather than re-deriving it client-side.
        break;
      case 'price-low':
        result = [...result].sort((a, b) => a.priceInPaise - b.priceInPaise);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.priceInPaise - a.priceInPaise);
        break;
    }

    return result;
  }, [allMods, search, activeCategory, sort, maxPrice]);

  function resetFilters() {
    setSearch('');
    setActiveCategory(null);
    setMaxPrice(priceCeiling);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <aside className="md:sticky md:top-20 h-fit">
        <BrowseControls
          search={search}
          onSearchChange={setSearch}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sort={sort}
          onSortChange={setSort}
          maxPrice={maxPrice}
          priceCeiling={priceCeiling}
          onMaxPriceChange={setMaxPrice}
        />
      </aside>

      <div>
        <p className="font-mono text-xs text-fog-dim mb-4">{filtered.length} mods found</p>

        {filtered.length === 0 ? (
          <EmptyState
            title={allMods.length === 0 ? 'No mods published yet' : 'No mods match those filters'}
            description={
              allMods.length === 0
                ? 'Check back soon — new mods will show up here as soon as they go live.'
                : 'Try widening your price range or clearing the category filter.'
            }
            ctaLabel={allMods.length > 0 ? 'Reset filters' : undefined}
            onCta={allMods.length > 0 ? resetFilters : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((mod) => (
              <ModCard key={mod.slug} mod={mod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
