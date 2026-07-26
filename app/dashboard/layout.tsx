import DashboardSidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="flex gap-6">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
