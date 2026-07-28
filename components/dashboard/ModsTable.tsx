'use client';

import { useState } from 'react';
import { Eye, EyeOff, Pencil, Trash2, Loader2 } from 'lucide-react';
import { cn, formatPrice, formatCount } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';
import { DashboardMod } from '@/lib/queries/dashboard';
import { toggleModStatus, deleteDraftMod } from '@/app/dashboard/actions';

const STATUS_STYLES: Record<string, string> = {
  published: 'border-signal/40 text-signal bg-signal/10',
  draft: 'border-fog-dim/40 text-fog-dim bg-white/5',
  pending: 'border-yellow-400/40 text-yellow-300 bg-yellow-400/10',
  unpublished: 'border-alert/40 text-alert bg-alert/10',
};

export default function ModsTable({ mods }: { mods: DashboardMod[] }) {
  const { showToast } = useToast();
  const [rows, setRows] = useState(mods);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  async function handleToggle(slug: string, currentStatus: string) {
    setPendingSlug(slug);
    const result = await toggleModStatus(slug, currentStatus);
    setPendingSlug(null);

    if (result.ok) {
      setRows((prev) =>
        prev.map((m) => (m.slug === slug ? { ...m, status: currentStatus === 'published' ? 'draft' : 'published' } : m))
      );
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  }

  async function handleDelete(slug: string, title: string) {
    setPendingSlug(slug);
    const result = await deleteDraftMod(slug);
    setPendingSlug(null);

    if (result.ok) {
      setRows((prev) => prev.filter((m) => m.slug !== slug));
      showToast('success', `${title} deleted.`);
    } else {
      showToast('error', result.message);
    }
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
                    STATUS_STYLES[mod.status] ?? STATUS_STYLES.draft
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
                  {pendingSlug === mod.slug ? (
                    <Loader2 className="w-4 h-4 animate-spin text-fog-dim" />
                  ) : (
                    <>
                      {(mod.status === 'published' || mod.status === 'draft') && (
                        <button
                          onClick={() => handleToggle(mod.slug, mod.status)}
                          className="p-1.5 rounded-md text-fog-dim hover:text-violet-bright hover:bg-white/5 transition-colors"
                          aria-label={mod.status === 'published' ? 'Unpublish' : 'Publish'}
                          title={mod.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {mod.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                      <button
                        className="p-1.5 rounded-md text-fog-dim hover:text-cyan hover:bg-white/5 transition-colors"
                        aria-label="Edit"
                        title="Edit (not built yet)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {mod.status === 'draft' && (
                        <button
                          onClick={() => handleDelete(mod.slug, mod.title)}
                          className="p-1.5 rounded-md text-fog-dim hover:text-alert hover:bg-alert/10 transition-colors"
                          aria-label="Delete draft"
                          title="Delete draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
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
