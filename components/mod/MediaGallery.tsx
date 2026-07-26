'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function MediaGallery({ screenshots, title }: { screenshots: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-video rounded-lg overflow-hidden glass reticle">
        <Image src={screenshots[active]} alt={`${title} screenshot ${active + 1}`} fill className="object-cover" />
      </div>

      {screenshots.length > 1 && (
        <div className="flex gap-3 mt-3">
          {screenshots.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative w-20 aspect-video rounded-md overflow-hidden border-2 transition-colors shrink-0',
                active === i ? 'border-violet-bright' : 'border-white/10 hover:border-white/30'
              )}
            >
              <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
