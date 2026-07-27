import RoleCommandPalette from '@/components/admin/RoleCommandPalette';

export default function AdminRolesPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Access control</p>
        <h1 className="font-display font-bold text-3xl">Role management</h1>
      </div>
      <RoleCommandPalette />
    </div>
  );
}
