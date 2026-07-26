import GlassCard from '@/components/ui/GlassCard';
import Sparkline from '@/components/dashboard/Sparkline';

interface StatCardProps {
  label: string;
  value: string;
  trend: number[];
  color?: string;
}

export default function StatCard({ label, value, trend, color = '#8b5cf6' }: StatCardProps) {
  return (
    <GlassCard className="p-5">
      <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-2">{label}</p>
      <p className="font-display font-bold text-2xl mb-3">{value}</p>
      <Sparkline data={trend} color={color} />
    </GlassCard>
  );
}
