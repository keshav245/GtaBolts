import GlassCard from '@/components/ui/GlassCard';

interface ChangelogEntry {
  version: string;
  date: string;
  notes: string[];
}

export default function Changelog({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <GlassCard key={entry.version} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm text-violet-bright">v{entry.version}</span>
            <span className="font-mono text-xs text-fog-dim">{entry.date}</span>
          </div>
          <ul className="space-y-1">
            {entry.notes.map((note, i) => (
              <li key={i} className="text-sm text-fog flex items-start gap-2">
                <span className="text-cyan mt-1">›</span>
                {note}
              </li>
            ))}
          </ul>
        </GlassCard>
      ))}
    </div>
  );
}
