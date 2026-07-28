import { DownloadLogEntry } from '@/lib/queries/library';

export default function DownloadHistoryTable({ entries }: { entries: DownloadLogEntry[] }) {
  return (
    <div className="glass rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Mod</th>
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-fog-dim font-medium">Downloaded at</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3">{entry.modTitle}</td>
              <td className="px-4 py-3 font-mono text-xs text-fog-dim">{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
