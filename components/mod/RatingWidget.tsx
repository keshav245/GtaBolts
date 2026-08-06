'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';
import { submitRating } from '@/app/mod/[slug]/actions';

interface RatingWidgetProps {
  modSlug: string;
  averageRating: number;
  ratingCount: number;
  currentUserCanRate: boolean;
  currentUserRating: number | null;
}

export default function RatingWidget({
  modSlug,
  averageRating,
  ratingCount,
  currentUserCanRate,
  currentUserRating,
}: RatingWidgetProps) {
  const { showToast } = useToast();
  const [hovered, setHovered] = useState<number | null>(null);
  const [myRating, setMyRating] = useState(currentUserRating);
  const [submitting, setSubmitting] = useState(false);

  async function handleRate(value: number) {
    setSubmitting(true);
    const result = await submitRating(modSlug, value);
    setSubmitting(false);

    if (result.ok) {
      setMyRating(value);
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  }

  return (
    <div className="border-t border-white/10 pt-6">
      <h2 className="font-display font-semibold text-xl mb-3">Rating</h2>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={cn('w-5 h-5', i <= Math.round(averageRating) ? 'text-signal fill-signal' : 'text-fog-dim')}
            />
          ))}
        </div>
        <span className="font-mono text-sm text-fog-dim">
          {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings yet'}
          {ratingCount > 0 && ` · ${ratingCount} rating${ratingCount === 1 ? '' : 's'}`}
        </span>
      </div>

      {currentUserCanRate ? (
        <div>
          <p className="text-xs text-fog-dim mb-2">{myRating ? 'Your rating' : 'Rate this mod'}</p>
          <div className="flex items-center gap-1">
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-violet-bright" />
            ) : (
              [1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => handleRate(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`Rate ${i} star${i === 1 ? '' : 's'}`}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'w-6 h-6 transition-colors',
                      (hovered ?? myRating ?? 0) >= i ? 'text-violet-bright fill-violet-bright' : 'text-fog-dim'
                    )}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-fog-dim">Only customers who&apos;ve purchased this mod can rate it.</p>
      )}
    </div>
  );
}
