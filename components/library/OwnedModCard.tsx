'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Loader2, RotateCw } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { OwnedMod } from '@/lib/queries/library';

export default function OwnedModCard({ mod }: { mod: OwnedMod }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch('/api/library/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modSlug: mod.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not generate a download link');
      window.location.href = data.downloadUrl;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Download failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="p-4 flex gap-4 items-center">
      <div className="relative w-24 aspect-video rounded-md overflow-hidden shrink-0">
        <Image src={mod.thumbnailUrl} alt={mod.title} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/mod/${mod.slug}`} className="font-display font-semibold text-sm hover:text-violet-bright transition-colors">
          {mod.title}
        </Link>
        <p className="font-mono text-xs text-fog-dim mt-1">
          Purchased {mod.purchasedAt} · v{mod.version}
        </p>
        <p className="flex items-center gap-1 text-xs text-fog-dim mt-1">
          <RotateCw className="w-3 h-3" /> Downloaded {mod.timesDownloaded}x
        </p>
      </div>

      <NeonButton size="sm" variant="secondary" onClick={handleDownload} disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Preparing
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </span>
        )}
      </NeonButton>
    </GlassCard>
  );
}
