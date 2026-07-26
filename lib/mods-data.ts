import { Mod } from '@/components/mods/ModCard';

export interface ModDetail extends Mod {
  description: string;
  screenshots: string[];
  changelog: { version: string; date: string; notes: string[] }[];
  views: number;
}

export const CATEGORIES = [
  { slug: 'gta-v', name: 'GTA V' },
  { slug: 'gta-online', name: 'GTA Online' },
  { slug: 'vice-city', name: 'Vice City' },
  { slug: 'san-andreas', name: 'San Andreas' },
];

const RAW: ModDetail[] = [
  {
    slug: 'cyberpunk-hud',
    title: 'Cyberpunk HUD Overhaul',
    category: 'GTA V',
    thumbnailUrl: '/placeholder-mod.jpg',
    priceInPaise: 19900,
    downloads: 4200,
    rating: 4.8,
    version: '2.3.1',
    views: 15230,
    description:
      'A complete HUD replacement inspired by neon-drenched dashboards. Custom minimap ring, animated health/armor bars, and a redesigned wanted-level display. Built to be lightweight — no measurable FPS impact.',
    screenshots: ['/placeholder-mod.jpg', '/placeholder-mod.jpg', '/placeholder-mod.jpg'],
    changelog: [
      { version: '2.3.1', date: '2026-06-14', notes: ['Fixed minimap clipping on ultrawide', 'Improved contrast on wanted stars'] },
      { version: '2.3.0', date: '2026-05-02', notes: ['Added animated armor bar', 'New color presets'] },
    ],
  },
  {
    slug: 'realistic-traffic',
    title: 'Realistic Traffic Pack',
    category: 'GTA Online',
    thumbnailUrl: '/placeholder-mod.jpg',
    priceInPaise: 14900,
    downloads: 3100,
    rating: 4.6,
    version: '1.8.0',
    views: 9870,
    description:
      'Overhauls traffic density, AI driving behavior, and lane discipline for a more grounded open-world feel. Includes config file for adjusting density per area.',
    screenshots: ['/placeholder-mod.jpg', '/placeholder-mod.jpg'],
    changelog: [{ version: '1.8.0', date: '2026-04-20', notes: ['Rebalanced highway density', 'Fixed rare traffic freeze bug'] }],
  },
  {
    slug: 'vice-city-skins',
    title: 'Vice City Skins Vol.2',
    category: 'Vice City',
    thumbnailUrl: '/placeholder-mod.jpg',
    priceInPaise: 9900,
    downloads: 1800,
    rating: 4.9,
    version: '1.0.4',
    views: 5210,
    description: '12 new hand-painted character skins with a retro-80s palette, matching the original Vice City tone.',
    screenshots: ['/placeholder-mod.jpg', '/placeholder-mod.jpg'],
    changelog: [{ version: '1.0.4', date: '2026-03-11', notes: ['Fixed texture seam on skin #7'] }],
  },
  {
    slug: 'weapon-bloom-fx',
    title: 'Weapon Bloom FX',
    category: 'GTA Online',
    thumbnailUrl: '/placeholder-mod.jpg',
    priceInPaise: 12900,
    downloads: 2650,
    rating: 4.4,
    version: '1.2.0',
    views: 7420,
    description: 'Adds dynamic muzzle flash bloom and improved tracer effects across all weapon classes.',
    screenshots: ['/placeholder-mod.jpg', '/placeholder-mod.jpg'],
    changelog: [{ version: '1.2.0', date: '2026-02-18', notes: ['Tuned bloom intensity for sniper rifles'] }],
  },
  {
    slug: 'night-city-lighting',
    title: 'Night City Lighting',
    category: 'GTA V',
    thumbnailUrl: '/placeholder-mod.jpg',
    priceInPaise: 17900,
    downloads: 3890,
    rating: 4.7,
    version: '3.0.0',
    views: 12040,
    description: 'Full ENB-style relighting for nighttime cycles — richer neon reflections, deeper shadows, softer street lighting.',
    screenshots: ['/placeholder-mod.jpg', '/placeholder-mod.jpg', '/placeholder-mod.jpg'],
    changelog: [{ version: '3.0.0', date: '2026-01-30', notes: ['Rebuilt lighting engine from scratch', 'Added 4 weather presets'] }],
  },
  {
    slug: 'san-andreas-remaster-roads',
    title: 'San Andreas Remaster: Roads',
    category: 'San Andreas',
    thumbnailUrl: '/placeholder-mod.jpg',
    priceInPaise: 8900,
    downloads: 1420,
    rating: 4.3,
    version: '1.1.0',
    views: 3980,
    description: 'Retextures every road, sidewalk, and highway surface at 4x resolution while preserving the original art direction.',
    screenshots: ['/placeholder-mod.jpg', '/placeholder-mod.jpg'],
    changelog: [{ version: '1.1.0', date: '2025-12-05', notes: ['Fixed tiling artifact on desert highways'] }],
  },
];

export function getAllMods(): ModDetail[] {
  return RAW;
}

export function getModBySlug(slug: string): ModDetail | undefined {
  return RAW.find((m) => m.slug === slug);
}

export function getModsByCategory(categorySlug: string): ModDetail[] {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return RAW.filter((m) => m.category === category.name);
}
