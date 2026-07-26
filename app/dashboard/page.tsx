import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import ModsTable from '@/components/dashboard/ModsTable';
import NeonButton from '@/components/ui/NeonButton';
import { formatPrice, formatCount } from '@/lib/utils';
import { EMPLOYEE_MODS, VIEWS_SPARKLINE, SALES_SPARKLINE, REVENUE_SPARKLINE, getEmployeeSummary } from '@/lib/dashboard-data';

// TODO: guard this route with private.has_role(auth.uid(), 'employee') (or 'owner')
// server-side, and scope EMPLOYEE_MODS to mods uploaded by the signed-in user.

export default function DashboardOverviewPage() {
  const summary = getEmployeeSummary();

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
        <StatCard label="Total views" value={formatCount(summary.totalViews)} trend={VIEWS_SPARKLINE} color="#22d3ee" />
        <StatCard label="Total sales" value={`${summary.totalSales}`} trend={SALES_SPARKLINE} color="#8b5cf6" />
        <StatCard label="Revenue share" value={formatPrice(summary.totalRevenue)} trend={REVENUE_SPARKLINE} color="#39ff88" />
      </div>

      <h2 className="font-display font-semibold text-xl mb-4">Your mods</h2>
      <ModsTable mods={EMPLOYEE_MODS} />
    </div>
  );
}
