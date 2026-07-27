'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import { EMPLOYEE_AUDITS } from '@/lib/admin-data';

export default function EmployeeAuditTable() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {EMPLOYEE_AUDITS.map((emp) => {
        const isOpen = expanded === emp.email;
        return (
          <GlassCard key={emp.email} className="overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : emp.email)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{emp.email}</p>
                <p className="font-mono text-xs text-fog-dim mt-1">
                  {emp.uploadCount} mods · {emp.totalSales} sales · {formatPrice(emp.totalRevenueInPaise)} revenue
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-fog-dim hidden sm:block">Last active {emp.lastActive}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-fog-dim" /> : <ChevronDown className="w-4 h-4 text-fog-dim" />}
              </div>
            </button>

            <div className={cn('grid transition-all duration-200', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <div className="px-4 pb-4 space-y-2 border-t border-white/10 pt-3">
                  {emp.activityLog.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-bright shrink-0" />
                      <span className="text-fog flex-1">{entry.action}</span>
                      <span className="font-mono text-xs text-fog-dim shrink-0">{entry.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
