'use client';

import { useMemo, useState } from 'react';
import { Search, ShieldPlus, X, Crown, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { PLATFORM_USERS, Role } from '@/lib/admin-data';

interface RoleActionResult {
  ok: boolean;
  code: 'granted' | 'revoked' | 'user_not_found' | 'already_has_role' | 'error';
  message: string;
}

// TODO: replace with a real server action calling supabaseAdmin to insert/delete
// a row in user_roles. On "user not found", real implementations typically write
// a pending_role_grants row keyed by email, applied automatically on first sign-up.
function grantRoleStub(email: string, role: Role): Promise<RoleActionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = PLATFORM_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        resolve({
          ok: true,
          code: 'user_not_found',
          message: `${email} hasn't signed up yet — the ${role} role will apply automatically once they do.`,
        });
        return;
      }
      if (user.roles.includes(role)) {
        resolve({ ok: false, code: 'already_has_role', message: `${email} already has the ${role} role.` });
        return;
      }
      resolve({ ok: true, code: 'granted', message: `Granted ${role} role to ${email}.` });
    }, 600);
  });
}

function revokeRoleStub(email: string, role: Role): Promise<RoleActionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ok: true, code: 'revoked', message: `Revoked ${role} role from ${email}.` });
    }, 500);
  });
}

export default function RoleCommandPalette() {
  const { showToast } = useToast();
  const [users, setUsers] = useState(PLATFORM_USERS);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('employee');
  const [submitting, setSubmitting] = useState(false);

  const roleHolders = useMemo(
    () => users.filter((u) => u.roles.includes('employee') || u.roles.includes('owner')),
    [users]
  );

  async function handleGrant() {
    if (!email.trim()) return;
    setSubmitting(true);
    const result = await grantRoleStub(email.trim(), role);
    setSubmitting(false);

    if (result.code === 'granted') {
      setUsers((prev) =>
        prev.some((u) => u.email.toLowerCase() === email.toLowerCase())
          ? prev.map((u) => (u.email.toLowerCase() === email.toLowerCase() ? { ...u, roles: [...u.roles, role] } : u))
          : [...prev, { id: `pending-${email}`, email, roles: [role], joinedAt: '—', totalSpentInPaise: 0, purchases: [] }]
      );
      showToast('success', result.message);
      setEmail('');
    } else if (result.code === 'user_not_found') {
      showToast('info', result.message);
      setEmail('');
    } else {
      showToast('warning', result.message);
    }
  }

  async function handleRevoke(targetEmail: string, targetRole: Role) {
    const result = await revokeRoleStub(targetEmail, targetRole);
    if (result.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.email === targetEmail ? { ...u, roles: u.roles.filter((r) => r !== targetRole) } : u))
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
              placeholder="Search or enter an email to grant a role..."
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
        <div className="flex flex-wrap gap-2">
          {roleHolders.map((user) =>
            user.roles
              .filter((r) => r !== 'user')
              .map((r) => (
                <div
                  key={`${user.email}-${r}`}
                  className={cn(
                    'flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full text-xs border',
                    r === 'owner' ? 'border-violet/40 bg-violet/10 text-violet-bright' : 'border-cyan/40 bg-cyan/10 text-cyan'
                  )}
                >
                  {r === 'owner' ? <Crown className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                  <span>{user.email}</span>
                  <span className="font-mono uppercase text-[10px] opacity-70">{r}</span>
                  <button
                    onClick={() => handleRevoke(user.email, r)}
                    className="hover:text-alert transition-colors"
                    aria-label={`Revoke ${r} from ${user.email}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
