'use client';

const RECENT = [
  { user: 'Rider_47', mod: 'Cyberpunk HUD Overhaul', time: '2m ago' },
  { user: 'GhostWheel', mod: 'Realistic Traffic Pack', time: '6m ago' },
  { user: 'Nyx.exe', mod: 'Vice City Skins Vol.2', time: '11m ago' },
  { user: 'K_Draven', mod: 'Weapon Bloom FX', time: '14m ago' },
  { user: 'ApexRunner', mod: 'Night City Lighting', time: '19m ago' },
];

export default function PurchaseTicker() {
  const items = [...RECENT, ...RECENT];

  return (
    <div className="border-y border-white/10 bg-ink/50 overflow-hidden py-2.5">
      <div className="flex gap-8 animate-ticker-scroll whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span key={i} className="font-mono text-xs text-fog-dim flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-blink" />
            <span className="text-cyan">{item.user}</span>
            <span>unlocked</span>
            <span className="text-violet-bright">{item.mod}</span>
            <span className="text-fog-dim/60">· {item.time}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
