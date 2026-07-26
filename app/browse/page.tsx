'use client';

import { useMemo, useState } from 'react';
import ModCard from '@/components/mods/ModCard';
import BrowseControls, { SortOption } from '@/components/browse/BrowseControls';
import EmptyState from '@/components/ui/EmptyState';
import { getAllMods } from '@/lib/mods-data';

export default function BrowsePage() {
  const allMods = useMemo(() => getAllMods(), []);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('popular');
  const [maxPrice, setMaxPrice] = useState(300);

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
        result = [...result].sort((a, b) => b.changelog.length - a.changelog.length);
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
    setMaxPrice(300);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Full catalog</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl">Browse mods</h1>
      </div>

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
            onMaxPriceChange={setMaxPrice}
          />
        </aside>

        <div>
          <p className="font-mono text-xs text-fog-dim mb-4">{filtered.length} mods found</p>

          {filtered.length === 0 ? (
            <EmptyState
              title="No mods match those filters"
              description="Try widening your price range or clearing the category filter."
              ctaLabel="Reset filters"
              onCta={resetFilters}
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
    </div>
  );
}
