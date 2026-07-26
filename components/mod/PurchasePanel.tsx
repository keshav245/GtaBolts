'use client';

import { useState } from 'react';
import { Eye, Download, Star, ShieldCheck, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { formatPrice, formatCount } from '@/lib/utils';
import { ModDetail } from '@/lib/mods-data';

export default function PurchasePanel({ mod }: { mod: ModDetail }) {
  const [loading, setLoading] = useState(false);

  function handleBuyNow() {
    setLoading(true);
    // TODO: replace with Razorpay checkout initiation (server action creates order,
    // opens Razorpay checkout, webhook verifies signature and grants library access).
    setTimeout(() => setLoading(false), 1200);
  }

  return (
    <GlassCard strong className="p-5 md:sticky md:top-20">
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-display font-bold text-3xl text-gradient">{formatPrice(mod.priceInPaise)}</span>
        <span className="font-mono text-xs text-fog-dim">v{mod.version}</span>
      </div>
      <p className="text-xs text-fog-dim mb-5">One-time purchase · lifetime access</p>

      <NeonButton size="lg" className="w-full mb-4" onClick={handleBuyNow} disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Processing...
          </span>
        ) : (
          'Buy now'
        )}
      </NeonButton>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="text-center py-2 rounded-md bg-white/5">
          <Eye className="w-4 h-4 mx-auto mb-1 text-cyan" />
          <p className="font-mono text-xs">{formatCount(mod.views)}</p>
        </div>
        <div className="text-center py-2 rounded-md bg-white/5">
          <Download className="w-4 h-4 mx-auto mb-1 text-violet-bright" />
          <p className="font-mono text-xs">{formatCount(mod.downloads)}</p>
        </div>
        <div className="text-center py-2 rounded-md bg-white/5">
          <Star className="w-4 h-4 mx-auto mb-1 text-signal fill-signal" />
          <p className="font-mono text-xs">{mod.rating.toFixed(1)}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-fog-dim border-t border-white/10 pt-4">
        <ShieldCheck className="w-4 h-4 text-signal shrink-0 mt-0.5" />
        <p>Secure checkout via Razorpay. Files are delivered through time-limited download links in your library.</p>
      </div>
    </GlassCard>
  );
}
