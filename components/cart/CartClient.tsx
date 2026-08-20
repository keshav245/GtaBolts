'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Loader2, ShoppingCart } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/ToastProvider';
import { formatPrice } from '@/lib/utils';
import { loadRazorpayScript } from '@/lib/razorpay-client';
import { CartItem } from '@/lib/queries/cart';
import { removeFromCart } from '@/app/cart/actions';

export default function CartClient({ initialItems }: { initialItems: CartItem[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState(initialItems);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const total = items.reduce((sum, item) => sum + item.priceInPaise, 0);

  async function handleRemove(modId: string) {
    setRemovingId(modId);
    const result = await removeFromCart(modId);
    setRemovingId(null);

    if (result.ok) {
      setItems((prev) => prev.filter((item) => item.modId !== modId));
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Could not load the payment checkout — check your connection.');

      const res = await fetch('/api/checkout/create-cart-order', { method: 'POST' });

      let order: any;
      try {
        order = await res.json();
      } catch {
        throw new Error('Server returned an unexpected response. Please try again.');
      }
      if (!res.ok) throw new Error(order.error ?? 'Could not start checkout');

      setCheckingOut(false);

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'GtaBolts',
        description: `${order.itemCount} mod${order.itemCount === 1 ? '' : 's'}`,
        theme: { color: '#8b5cf6' },
        handler: () => {
          showToast('success', 'Payment received — unlocking your downloads...');
          router.push('/library');
        },
      });

      rzp.open();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Checkout failed');
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Add a few mods from the catalog and check out all at once."
        ctaLabel="Browse mods"
        onCta={() => router.push('/browse')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-start">
      <div className="space-y-3">
        {items.map((item) => (
          <GlassCard key={item.modId} className="p-4 flex gap-4 items-center">
            <div className="relative w-20 aspect-video rounded-md overflow-hidden shrink-0">
              <img src={item.thumbnailUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/mod/${item.slug}`} className="font-display font-semibold text-sm hover:text-violet-bright transition-colors">
                {item.title}
              </Link>
              <p className="font-mono text-xs text-cyan mt-1">{formatPrice(item.priceInPaise)}</p>
            </div>
            <button
              onClick={() => handleRemove(item.modId)}
              disabled={removingId === item.modId}
              className="p-2 rounded-md text-fog-dim hover:text-alert hover:bg-alert/10 transition-colors"
              aria-label="Remove from cart"
            >
              {removingId === item.modId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </GlassCard>
        ))}
      </div>

      <GlassCard strong className="p-5 md:sticky md:top-20">
        <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-2">
          {items.length} item{items.length === 1 ? '' : 's'}
        </p>
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-sm text-fog">Total</span>
          <span className="font-display font-bold text-2xl text-gradient">{formatPrice(total)}</span>
        </div>
        <NeonButton size="lg" className="w-full" onClick={handleCheckout} disabled={checkingOut}>
          {checkingOut ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Starting checkout...
            </span>
          ) : (
            'Checkout'
          )}
        </NeonButton>
      </GlassCard>
    </div>
  );
}
