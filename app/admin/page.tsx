import GlassCard from '@/components/ui/GlassCard';
import StatCard from '@/components/dashboard/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice, formatCount } from '@/lib/utils';
import { getRevenueSummary } from '@/lib/queries/admin';

// Sparklines are decorative — no daily-history table exists yet, so this
// draws a gentle upward line ending at the real current total rather than
// claiming to show actual day-by-day history.
function decorativeTrend(finalValue: number) {
  return Array.from({ length: 12 }, (_, i) => Math.round((finalValue * (i + 1)) / 12)) || [0];
}

export default async function AdminOverviewPage() {
  const { totalRevenue, totalSales, activeMods, topMods, topEmployees } = await getRevenueSummary();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Platform revenue</p>
        <h1 className="font-display font-bold text-3xl">Revenue overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total revenue" value={formatPrice(totalRevenue)} trend={decorativeTrend(totalRevenue || 1)} color="#39ff88" />
        <StatCard label="Total sales" value={`${totalSales}`} trend={decorativeTrend(totalSales || 1)} color="#8b5cf6" />
        <StatCard label="Active mods" value={`${activeMods}`} trend={decorativeTrend(activeMods || 1)} color="#22d3ee" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display font-semibold text-xl mb-4">Top mods by revenue</h2>
          {topMods.length === 0 ? (
            <EmptyState title="No sales yet" description="Top mods will show up here once purchases start coming in." />
          ) : (
            <div className="space-y-2">
              {topMods.map((mod, i) => (
                <GlassCard key={mod.slug} className="p-4 flex items-center gap-3">
                  <span className="font-mono text-sm text-violet-bright w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{mod.title}</p>
                    <p className="font-mono text-xs text-fog-dim">{formatCount(mod.sales)} sales</p>
                  </div>
                  <span className="font-mono text-sm text-signal">{formatPrice(mod.revenueInPaise)}</span>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display font-semibold text-xl mb-4">Top employees by revenue</h2>
          {topEmployees.length === 0 ? (
            <EmptyState title="No employees yet" description="Grant someone the employee role in Role management to get started." />
          ) : (
            <div className="space-y-2">
              {topEmployees.map((emp, i) => (
                <GlassCard key={emp.email} className="p-4 flex items-center gap-3">
                  <span className="font-mono text-sm text-violet-bright w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{emp.email}</p>
                    <p className="font-mono text-xs text-fog-dim">{emp.uploadCount} mods · {emp.totalSales} sales</p>
                  </div>
                  <span className="font-mono text-sm text-signal">{formatPrice(emp.totalRevenueInPaise)}</span>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
