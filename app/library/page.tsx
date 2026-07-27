import Link from 'next/link';
import OwnedModCard from '@/components/library/OwnedModCard';
import DownloadHistoryTable from '@/components/library/DownloadHistoryTable';
import EmptyState from '@/components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';
import { OWNED_MODS, DOWNLOAD_LOG } from '@/lib/library-data';
import { requireUser } from '@/lib/auth-guards';

// TODO: fetch OWNED_MODS / DOWNLOAD_LOG from Supabase (purchases table joined
// with mods) scoped to `user.id` instead of the mock import above.

export default async function LibraryPage() {
  await requireUser();

  const hasPurchases = OWNED_MODS.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Your library</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl">Owned mods</h1>
      </div>

      {!hasPurchases ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your library is empty"
          description="Mods you buy will show up here with instant, time-limited download links."
        />
      ) : (
        <>
          <div className="space-y-3 mb-12">
            {OWNED_MODS.map((mod) => (
              <OwnedModCard key={mod.slug} mod={mod} />
            ))}
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl mb-4">Download history</h2>
            <DownloadHistoryTable entries={DOWNLOAD_LOG} />
          </div>
        </>
      )}

      <div className="mt-10">
        <Link href="/browse" className="text-sm text-cyan hover:text-cyan-bright transition-colors">
          ← Browse more mods
        </Link>
      </div>
    </div>
  );
}
