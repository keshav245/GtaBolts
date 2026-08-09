import { cn } from '@/lib/utils';
import { ActivityItem } from '@/lib/queries/activity';

const DOT_COLOR: Record<ActivityItem['type'], string> = {
  purchase: 'bg-signal',
  new_mod: 'bg-violet-bright',
  new_category: 'bg-cyan',
};

const TEXT_COLOR: Record<ActivityItem['type'], string> = {
  purchase: 'text-cyan',
  new_mod: 'text-violet-bright',
  new_category: 'text-cyan',
};

export default function ActivityTicker({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return null;

  // Duplicated once so the CSS marquee loop has no visible seam.
  const looped = [...items, ...items];

  return (
    <div className="border-y border-white/10 bg-ink/50 overflow-hidden py-2.5">
      <div className="flex gap-8 animate-ticker-scroll whitespace-nowrap w-max">
        {looped.map((item, i) => (
          <span key={`${item.id}-${i}`} className="font-mono text-xs text-fog-dim flex items-center gap-2">
            <span className={cn('w-1.5 h-1.5 rounded-full animate-blink', DOT_COLOR[item.type])} />
            <span className={TEXT_COLOR[item.type]}>{item.text}</span>
            <span className="text-fog-dim/60">· {item.timeLabel}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
