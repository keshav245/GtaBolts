'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ModCard, { Mod } from '@/components/mods/ModCard';

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

export default function FeaturedCarousel({ mods }: { mods: Mod[] }) {
  if (mods.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl">Featured mods</h2>
        <span className="font-mono text-xs text-violet-bright uppercase tracking-wider">Trending now</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mods.slice(0, 3).map((mod, i) => (
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
