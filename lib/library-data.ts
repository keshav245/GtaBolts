import { Mod } from '@/components/mods/ModCard';

export interface OwnedMod extends Mod {
  purchasedAt: string;
  timesDownloaded: number;
}

export interface DownloadLogEntry {
  modTitle: string;
  timestamp: string;
}

export const OWNED_MODS: OwnedMod[] = [
  {
    slug: 'cyberpunk-hud',
    title: 'Cyberpunk HUD Overhaul',
    category: 'GTA V',
    thumbnailUrl: '/placeholder-mod.jpg',
    priceInPaise: 19900,
    downloads: 4200,
    rating: 4.8,
    version: '2.3.1',
    purchasedAt: '2026-06-02',
    timesDownloaded: 3,
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
    purchasedAt: '2026-05-14',
    timesDownloaded: 1,
  },
];

export const DOWNLOAD_LOG: DownloadLogEntry[] = [
  { modTitle: 'Cyberpunk HUD Overhaul', timestamp: '2026-07-20 14:32' },
  { modTitle: 'Cyberpunk HUD Overhaul', timestamp: '2026-06-18 09:11' },
  { modTitle: 'Weapon Bloom FX', timestamp: '2026-05-14 20:45' },
  { modTitle: 'Cyberpunk HUD Overhaul', timestamp: '2026-06-02 16:03' },
];
