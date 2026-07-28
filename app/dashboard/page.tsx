import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import ModsTable from '@/components/dashboard/ModsTable';
import NeonButton from '@/components/ui/NeonButton';
import { formatPrice, formatCount } from '@/lib/utils';
import { getMyMods, getSummary } from '@/lib/queries/dashboard';

// Sparklines are decorative — there's no daily-history table yet, so this
// just draws a gentle upward line ending at the real current total, rather
// than claiming to show actual day-by-day trend data.
function decorativeTrend(finalValue: number) {
  return Array.from({ length: 12 }, (_, i) => Math.round((finalValue * (i + 1)) / 12));
}

export default async function DashboardOverviewPage() {
  const mods = await getMyMods();
  const summary = getSummary(mods);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Employee console</p>
          <h1 className="font-display font-bold text-3xl">Overview</h1>
        </div>
        <Link href="/dashboard/upload">
          <NeonButton>Upload mod</NeonButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total views" value={formatCount(summary.totalViews)} trend={decorativeTrend(summary.totalViews)} color="#22d3ee" />
        <StatCard label="Total sales" value={`${summary.totalSales}`} trend={decorativeTrend(summary.totalSales)} color="#8b5cf6" />
        <StatCard label="Revenue share" value={formatPrice(summary.totalRevenue)} trend={decorativeTrend(summary.totalRevenue)} color="#39ff88" />
      </div>

      <h2 className="font-display font-semibold text-xl mb-4">Your mods</h2>
      {mods.length === 0 ? (
        <p className="text-fog-dim text-sm">
          You haven&apos;t uploaded anything yet.{' '}
          <Link href="/dashboard/upload" className="text-cyan hover:text-cyan-bright transition-colors">
            Upload your first mod
          </Link>
          .
        </p>
      ) : (
        <ModsTable mods={mods} />
      )}
    </div>
  );
}
