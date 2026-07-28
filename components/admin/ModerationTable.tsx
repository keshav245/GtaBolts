'use client';

import { useState } from 'react';
import { Check, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { cn, formatPrice, formatCount } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';
import { PlatformMod } from '@/lib/queries/admin';
import { approveMod, unpublishMod, deleteModAsOwner } from '@/app/admin/moderation/actions';

const STATUS_STYLES: Record<string, string> = {
  published: 'border-signal/40 text-signal bg-signal/10',
  pending: 'border-yellow-400/40 text-yellow-300 bg-yellow-400/10',
  draft: 'border-fog-dim/40 text-fog-dim bg-white/5',
  unpublished: 'border-alert/40 text-alert bg-alert/10',
};

export default function ModerationTable({ mods }: { mods: PlatformMod[] }) {
  const { showToast } = useToast();
  const [rows, setRows] = useState(mods);
  const [filter, setFilter] = useState<'all' | string>('all');
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  async function approve(slug: string, title: string) {
    setPendingSlug(slug);
    const result = await approveMod(slug);
    setPendingSlug(null);
    if (result.ok) {
      setRows((prev) => prev.map((m) => (m.slug === slug ? { ...m, status: 'published' } : m)));
      showToast('success', `${title} approved and published.`);
    } else {
      showToast('error', result.message);
    }
  }

  async function unpublish(slug: string, title: string) {
    setPendingSlug(slug);
    const result = await unpublishMod(slug);
    setPendingSlug(null);
    if (result.ok) {
      setRows((prev) => prev.map((m) => (m.slug === slug ? { ...m, status: 'unpublished' } : m)));
      showToast('warning', `${title} unpublished.`);
    } else {
      showToast('error', result.message);
    }
  }

  async function remove(slug: string, title: string) {
    setPendingSlug(slug);
    const result = await deleteModAsOwner(slug);
    setPendingSlug(null);
    if (result.ok) {
      setRows((prev) => prev.filter((m) => m.slug !== slug));
      showToast('error', `${title} deleted from the platform.`);
    } else {
      showToast('error', result.message);
    }
  }

  const filterOptions = ['all', ...Array.from(new Set(mods.map((m) => m.status)))];
  const filtered = filter === 'all' ? rows : rows.filter((m) => m.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize',
              filter === f ? 'bg-violet/20 border-violet text-violet-bright' : 'border-white/10 text-fog hover:border-white/30'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-fog-dim">No mods {filter !== 'all' ? `with status "${filter}"` : 'yet'}.</p>
      ) : (
        <div className="glass rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Mod</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Uploader</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Status</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Sales</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Revenue</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((mod) => (
                <tr key={mod.slug} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{mod.title}</p>
                    <p className="font-mono text-xs text-fog-dim">{mod.category}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-fog">{mod.uploader}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border', STATUS_STYLES[mod.status] ?? STATUS_STYLES.draft)}>
                      {mod.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{formatCount(mod.sales)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-cyan">{formatPrice(mod.revenueInPaise)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {pendingSlug === mod.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin text-fog-dim" />
                      ) : (
                        <>
                          {mod.status !== 'published' && (
                            <button onClick={() => approve(mod.slug, mod.title)} className="p-1.5 rounded-md text-fog-dim hover:text-signal hover:bg-signal/10 transition-colors" title="Approve & publish">
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {mod.status !== 'unpublished' && (
                            <button onClick={() => unpublish(mod.slug, mod.title)} className="p-1.5 rounded-md text-fog-dim hover:text-yellow-300 hover:bg-yellow-400/10 transition-colors" title="Unpublish">
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => remove(mod.slug, mod.title)} className="p-1.5 rounded-md text-fog-dim hover:text-alert hover:bg-alert/10 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
