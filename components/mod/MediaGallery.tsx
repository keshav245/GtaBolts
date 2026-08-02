'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function MediaGallery({ screenshots, title }: { screenshots: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-video rounded-lg overflow-hidden glass reticle">
        {/* Plain <img> — expiring presigned R2 URL, not worth Next's image optimizer */}
        <img src={screenshots[active]} alt={`${title} screenshot ${active + 1}`} className="absolute inset-0 w-full h-full object-cover" />
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
              <img src={src} alt={`Thumbnail ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
