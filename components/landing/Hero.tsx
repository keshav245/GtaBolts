'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import NeonButton from '@/components/ui/NeonButton';

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center border-b border-white/10">
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh-shift" />
      <div className="absolute inset-0 bg-void/40" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-24 w-full">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-4"
        >
          // Verified mods. Instant delivery.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-5xl md:text-7xl leading-[1.05] max-w-3xl"
        >
          Mod your world.
          <br />
          <span className="text-gradient">Own the upgrade.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-xl text-fog text-lg"
        >
          Browse a growing catalog of GTA mods, built and vetted by the community. Buy once, download anytime.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link href="/browse">
            <NeonButton size="lg">Browse mods</NeonButton>
          </Link>
          <Link href="/auth">
            <NeonButton size="lg" variant="secondary">Sign up free</NeonButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
