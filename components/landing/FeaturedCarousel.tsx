'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ModCard, { Mod } from '@/components/mods/ModCard';

const FEATURED: Mod[] = [
  { slug: 'cyberpunk-hud', title: 'Cyberpunk HUD Overhaul', category: 'GTA V', thumbnailUrl: '/placeholder-mod.jpg', priceInPaise: 19900, downloads: 4200, rating: 4.8, version: '2.3.1' },
  { slug: 'realistic-traffic', title: 'Realistic Traffic Pack', category: 'GTA Online', thumbnailUrl: '/placeholder-mod.jpg', priceInPaise: 14900, downloads: 3100, rating: 4.6, version: '1.8.0' },
  { slug: 'vice-city-skins', title: 'Vice City Skins Vol.2', category: 'Vice City', thumbnailUrl: '/placeholder-mod.jpg', priceInPaise: 9900, downloads: 1800, rating: 4.9, version: '1.0.4' },
];

function TiltWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)');

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`);
  }

  function handleMouseLeave() {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg)');
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.15s ease-out' }}
    >
      {children}
    </div>
  );
}

export default function FeaturedCarousel() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl">Featured mods</h2>
        <span className="font-mono text-xs text-violet-bright uppercase tracking-wider">Trending now</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURED.map((mod, i) => (
          <motion.div
            key={mod.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <TiltWrapper>
              <ModCard mod={mod} />
            </TiltWrapper>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
