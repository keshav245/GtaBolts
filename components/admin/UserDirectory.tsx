'use client';

import { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp, Crown, Wrench } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import EmptyState from '@/components/ui/EmptyState';
import { PlatformUser } from '@/lib/queries/admin';

export default function UserDirectory({ users }: { users: PlatformUser[] }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () => users.filter((u) => u.email.toLowerCase().includes(query.toLowerCase())),
    [users, query]
  );

  return (
    <div>
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fog-dim" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by email..."
          className="w-full max-w-md glass rounded-md pl-9 pr-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => {
            const isOpen = expanded === user.id;
            return (
              <GlassCard key={user.id} className="overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : user.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm">{user.email}</p>
                      <p className="font-mono text-xs text-fog-dim mt-1">
                        Joined {user.joinedAt} · {formatPrice(user.totalSpentInPaise)} spent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.roles.includes('owner') && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono uppercase border border-violet/40 bg-violet/10 text-violet-bright">
                        <Crown className="w-3 h-3" /> owner
                      </span>
                    )}
                    {user.roles.includes('employee') && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono uppercase border border-cyan/40 bg-cyan/10 text-cyan">
                        <Wrench className="w-3 h-3" /> employee
                      </span>
                    )}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-fog-dim" /> : <ChevronDown className="w-4 h-4 text-fog-dim" />}
                  </div>
                </button>

                <div className={cn('grid transition-all duration-200', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-white/10 pt-3">
                      {user.purchases.length === 0 ? (
                        <p className="text-sm text-fog-dim">No purchases yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {user.purchases.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-fog">{p.modTitle}</span>
                              <span className="font-mono text-xs text-fog-dim">{p.date}</span>
                              <span className="font-mono text-xs text-cyan">{formatPrice(p.priceInPaise)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
