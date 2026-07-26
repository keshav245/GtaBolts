'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/mods-data';

export type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high';

interface BrowseControlsProps {
  search: string;
  onSearchChange: (v: string) => void;
  activeCategory: string | null;
  onCategoryChange: (v: string | null) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
];

export default function BrowseControls({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  maxPrice,
  onMaxPriceChange,
}: BrowseControlsProps) {
  return (
    <div className="glass rounded-lg p-4 md:p-5 space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fog-dim" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search mods..."
          className="w-full glass rounded-md pl-9 pr-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
        />
      </div>

      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              activeCategory === null
                ? 'bg-violet/20 border-violet text-violet-bright'
                : 'border-white/10 text-fog hover:border-white/30'
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.name)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                activeCategory === cat.name
                  ? 'bg-violet/20 border-violet text-violet-bright'
                  : 'border-white/10 text-fog hover:border-white/30'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim">Max price</p>
          <span className="text-xs font-mono text-cyan">₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min={0}
          max={300}
          step={10}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-violet"
        />
      </div>

      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-2 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3 h-3" /> Sort by
        </p>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full glass rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-violet/50 transition-all"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-ink">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
