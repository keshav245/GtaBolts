'use client';

import { useState } from 'react';
import { Search, ShieldPlus, X, Crown, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { RoleHolder } from '@/lib/queries/admin';
import { grantRoleAction, revokeRoleAction } from '@/app/admin/roles/actions';

type Role = 'employee' | 'owner';

export default function RoleCommandPalette({ initialHolders }: { initialHolders: RoleHolder[] }) {
  const { showToast } = useToast();
  const [holders, setHolders] = useState(initialHolders);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('employee');
  const [submitting, setSubmitting] = useState(false);

  async function handleGrant() {
    if (!email.trim()) return;
    setSubmitting(true);
    const result = await grantRoleAction(email.trim(), role);
    setSubmitting(false);

    if (result.code === 'granted') {
      setHolders((prev) => {
        const existing = prev.find((h) => h.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          return prev.map((h) => (h.email.toLowerCase() === email.toLowerCase() ? { ...h, roles: [...h.roles, role] } : h));
        }
        // We don't have the real user id client-side for a brand-new holder;
        // a revalidate/refresh (revalidatePath in the action) will backfill it
        // with the real id on next load. This is just optimistic UI in the meantime.
        return [...prev, { id: `pending-${email}`, email: email.trim(), roles: [role] }];
      });
      showToast('success', result.message);
      setEmail('');
    } else if (result.code === 'user_not_found') {
      showToast('info', result.message);
    } else {
      showToast('warning', result.message);
    }
  }

  async function handleRevoke(userId: string, targetEmail: string, targetRole: Role) {
    const result = await revokeRoleAction(userId, targetEmail, targetRole);
    if (result.ok) {
      setHolders((prev) =>
        prev
          .map((h) => (h.id === userId ? { ...h, roles: h.roles.filter((r) => r !== targetRole) } : h))
          .filter((h) => h.roles.length > 0)
      );
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard strong className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fog-dim" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGrant()}
              placeholder="Enter a signed-up user's email to grant a role..."
              className="w-full glass rounded-md pl-9 pr-3 py-3 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="glass rounded-md px-3 py-3 text-sm focus:outline-none focus:border-violet/50 transition-all"
          >
            <option value="employee" className="bg-ink">Employee</option>
            <option value="owner" className="bg-ink">Owner</option>
          </select>
          <NeonButton onClick={handleGrant} disabled={submitting || !email.trim()}>
            <span className="flex items-center gap-1.5">
              <ShieldPlus className="w-4 h-4" /> {submitting ? 'Granting...' : 'Grant role'}
            </span>
          </NeonButton>
        </div>
      </GlassCard>

      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-3">Current role holders</p>
        {holders.length === 0 ? (
          <p className="text-sm text-fog-dim">No employees or owners yet, other than you.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {holders.map((holder) =>
              holder.roles.map((r) => (
                <div
                  key={`${holder.email}-${r}`}
                  className={cn(
                    'flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full text-xs border',
                    r === 'owner' ? 'border-violet/40 bg-violet/10 text-violet-bright' : 'border-cyan/40 bg-cyan/10 text-cyan'
                  )}
                >
                  {r === 'owner' ? <Crown className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                  <span>{holder.email}</span>
                  <span className="font-mono uppercase text-[10px] opacity-70">{r}</span>
                  <button
                    onClick={() => handleRevoke(holder.id, holder.email, r as Role)}
                    className="hover:text-alert transition-colors"
                    aria-label={`Revoke ${r} from ${holder.email}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
