'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Download, Star, ShieldCheck, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { formatPrice, formatCount } from '@/lib/utils';
import type { ModDetailResult } from '@/lib/queries/mods';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout-js')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PurchasePanel({ mod }: { mod: ModDetailResult }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleBuyNow() {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Could not load the payment checkout — check your connection.');

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modSlug: mod.slug }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error ?? 'Could not start checkout');

      setLoading(false);

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'GTAMods',
        description: order.modTitle,
        theme: { color: '#8b5cf6' },
        handler: () => {
          // The webhook is the source of truth for granting access — this is
          // just fast client-side feedback while it processes (usually seconds).
          showToast('success', 'Payment received — unlocking your download...');
          router.push('/library');
        },
      });

      rzp.open();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
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
            <Loader2 className="w-4 h-4 animate-spin" /> Starting checkout...
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
