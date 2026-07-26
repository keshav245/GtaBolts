'use client';

import { useState } from 'react';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { cn, formatPrice, formatCount } from '@/lib/utils';
import { DashboardMod } from '@/lib/dashboard-data';

export default function ModsTable({ mods }: { mods: DashboardMod[] }) {
  const [rows, setRows] = useState(mods);

  function toggleStatus(slug: string) {
    // TODO: call server action to update the mod's published/draft status in Supabase.
    setRows((prev) =>
      prev.map((m) => (m.slug === slug ? { ...m, status: m.status === 'published' ? 'draft' : 'published' } : m))
    );
  }

  function removeMod(slug: string) {
    // TODO: call server action to delete the draft (only drafts should be deletable here).
    setRows((prev) => prev.filter((m) => m.slug !== slug));
  }

  return (
    <div className="glass rounded-lg overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Mod</th>
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Status</th>
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Views</th>
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Sales</th>
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Revenue</th>
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((mod) => (
            <tr key={mod.slug} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium">{mod.title}</p>
                <p className="font-mono text-xs text-fog-dim">{mod.category}</p>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border',
                    mod.status === 'published'
                      ? 'border-signal/40 text-signal bg-signal/10'
                      : 'border-fog-dim/40 text-fog-dim bg-white/5'
                  )}
                >
                  {mod.status}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{formatCount(mod.views)}</td>
              <td className="px-4 py-3 font-mono text-xs">{mod.sales}</td>
              <td className="px-4 py-3 font-mono text-xs text-cyan">{formatPrice(mod.revenueInPaise)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => toggleStatus(mod.slug)}
                    className="p-1.5 rounded-md text-fog-dim hover:text-violet-bright hover:bg-white/5 transition-colors"
                    aria-label={mod.status === 'published' ? 'Unpublish' : 'Publish'}
                    title={mod.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {mod.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    className="p-1.5 rounded-md text-fog-dim hover:text-cyan hover:bg-white/5 transition-colors"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {mod.status === 'draft' && (
                    <button
                      onClick={() => removeMod(mod.slug)}
                      className="p-1.5 rounded-md text-fog-dim hover:text-alert hover:bg-alert/10 transition-colors"
                      aria-label="Delete draft"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
