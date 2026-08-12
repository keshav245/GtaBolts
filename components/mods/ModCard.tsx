'use client';

import Link from 'next/link';
import { Download, Star } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { formatPrice, formatCount } from '@/lib/utils';

export interface Mod {
  slug: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  priceInPaise: number;
  downloads: number;
  rating: number;
  version: string;
}

export default function ModCard({ mod }: { mod: Mod }) {
  return (
    <Link href={`/mod/${mod.slug}`}>
      <GlassCard reticle className="group overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={mod.thumbnailUrl}
            alt={mod.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <AddToCartButton modSlug={mod.slug} variant="icon" />
          </div>

          <div className="absolute top-2 right-2 font-mono text-xs px-2 py-1 rounded bg-void/70 backdrop-blur-sm border border-violet/40 text-violet-bright">
            {formatPrice(mod.priceInPaise)}
          </div>

          {/* Quick stats reveal on hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex items-center gap-3 bg-gradient-to-t from-void/90 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <span className="flex items-center gap-1 text-xs font-mono text-cyan">
              <Download className="w-3 h-3" /> {formatCount(mod.downloads)}
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-signal">
              <Star className="w-3 h-3 fill-signal" /> {mod.rating.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-fog-dim">v{mod.version}</span>
          </div>
        </div>

        <div className="p-3">
          <p className="text-[11px] font-mono uppercase tracking-wider text-violet-bright/70">{mod.category}</p>
          <h3 className="font-display font-semibold text-sm mt-1 truncate group-hover:text-white transition-colors">
            {mod.title}
          </h3>
        </div>
      </GlassCard>
    </Link>
  );
}
