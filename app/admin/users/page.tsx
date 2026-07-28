import UserDirectory from '@/components/admin/UserDirectory';
import { getAllUsers } from '@/lib/queries/admin';

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// All accounts</p>
        <h1 className="font-display font-bold text-3xl">User directory</h1>
      </div>
      <UserDirectory users={users} />
    </div>
  );
}
