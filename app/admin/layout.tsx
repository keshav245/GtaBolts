import AdminSidebar from '@/components/admin/Sidebar';
import { requireRole } from '@/lib/auth-guards';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole('owner');

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="flex gap-6">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
