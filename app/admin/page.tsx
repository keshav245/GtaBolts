import GlassCard from '@/components/ui/GlassCard';
import StatCard from '@/components/dashboard/StatCard';
import { formatPrice, formatCount } from '@/lib/utils';
import { getRevenueSummary, REVENUE_SPARKLINE } from '@/lib/admin-data';

export default function AdminOverviewPage() {
  const { totalRevenue, totalSales, topMods, topEmployees } = getRevenueSummary();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Platform revenue</p>
        <h1 className="font-display font-bold text-3xl">Revenue overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total revenue" value={formatPrice(totalRevenue)} trend={REVENUE_SPARKLINE} color="#39ff88" />
        <StatCard label="Total sales" value={`${totalSales}`} trend={REVENUE_SPARKLINE.map((v) => v / 1000)} color="#8b5cf6" />
        <StatCard label="Active mods" value={`${topMods.length + 2}`} trend={REVENUE_SPARKLINE.map((v) => v / 1200)} color="#22d3ee" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display font-semibold text-xl mb-4">Top mods by revenue</h2>
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
        </div>

        <div>
          <h2 className="font-display font-semibold text-xl mb-4">Top employees by revenue</h2>
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
        </div>
      </div>
    </div>
  );
}
