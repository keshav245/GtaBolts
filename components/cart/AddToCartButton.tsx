'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';
import { addToCart } from '@/app/cart/actions';

interface AddToCartButtonProps {
  modSlug: string;
  variant?: 'icon' | 'full';
  className?: string;
}

export default function AddToCartButton({ modSlug, variant = 'full', className }: AddToCartButtonProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (added || loading) return;

    setLoading(true);
    const result = await addToCart(modSlug);
    setLoading(false);

    if (result.ok) {
      setAdded(true);
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={loading || added}
        aria-label="Add to cart"
        title={added ? 'In cart' : 'Add to cart'}
        className={cn(
          'p-2 rounded-md bg-void/70 backdrop-blur-sm border border-white/10 transition-colors',
          added ? 'text-signal border-signal/40' : 'text-fog hover:text-violet-bright hover:border-violet/40',
          className
        )}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || added}
      className={cn(
        'flex items-center justify-center gap-2 glass rounded-md py-2.5 text-sm font-display font-semibold transition-all',
        added ? 'text-signal border-signal/40' : 'text-cyan border-cyan/30 hover:bg-cyan/10 hover:border-cyan/60',
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : added ? (
        <>
          <Check className="w-4 h-4" /> In cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" /> Add to cart
        </>
      )}
    </button>
  );
}
