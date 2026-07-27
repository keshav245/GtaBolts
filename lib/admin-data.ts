export type Role = 'user' | 'employee' | 'owner';

export interface PlatformUser {
  id: string;
  email: string;
  roles: Role[];
  joinedAt: string;
  totalSpentInPaise: number;
  purchases: { modTitle: string; date: string; priceInPaise: number }[];
}

export const PLATFORM_USERS: PlatformUser[] = [
  {
    id: 'u1',
    email: 'keshavshukla223@gmail.com',
    roles: ['owner'],
    joinedAt: '2025-11-02',
    totalSpentInPaise: 0,
    purchases: [],
  },
  {
    id: 'u2',
    email: 'arjun.dev@gmail.com',
    roles: ['employee'],
    joinedAt: '2026-01-15',
    totalSpentInPaise: 19900,
    purchases: [{ modTitle: 'Cyberpunk HUD Overhaul', date: '2026-06-02', priceInPaise: 19900 }],
  },
  {
    id: 'u3',
    email: 'rider47@outlook.com',
    roles: ['user'],
    joinedAt: '2026-03-22',
    totalSpentInPaise: 32800,
    purchases: [
      { modTitle: 'Cyberpunk HUD Overhaul', date: '2026-06-14', priceInPaise: 19900 },
      { modTitle: 'Weapon Bloom FX', date: '2026-05-14', priceInPaise: 12900 },
    ],
  },
  {
    id: 'u4',
    email: 'ghostwheel@proton.me',
    roles: ['user'],
    joinedAt: '2026-04-09',
    totalSpentInPaise: 14900,
    purchases: [{ modTitle: 'Realistic Traffic Pack', date: '2026-05-11', priceInPaise: 14900 }],
  },
];

export interface PlatformMod {
  slug: string;
  title: string;
  uploader: string;
  category: string;
  status: 'pending' | 'published' | 'unpublished';
  sales: number;
  revenueInPaise: number;
  uploadedAt: string;
}

export const PLATFORM_MODS: PlatformMod[] = [
  { slug: 'cyberpunk-hud', title: 'Cyberpunk HUD Overhaul', uploader: 'arjun.dev@gmail.com', category: 'GTA V', status: 'published', sales: 210, revenueInPaise: 210 * 19900, uploadedAt: '2026-06-14' },
  { slug: 'night-city-lighting', title: 'Night City Lighting', uploader: 'arjun.dev@gmail.com', category: 'GTA V', status: 'published', sales: 178, revenueInPaise: 178 * 17900, uploadedAt: '2026-01-30' },
  { slug: 'weapon-bloom-fx', title: 'Weapon Bloom FX', uploader: 'arjun.dev@gmail.com', category: 'GTA Online', status: 'pending', sales: 0, revenueInPaise: 0, uploadedAt: '2026-07-18' },
  { slug: 'vice-city-skins', title: 'Vice City Skins Vol.2', uploader: 'maya.codes@gmail.com', category: 'Vice City', status: 'published', sales: 64, revenueInPaise: 64 * 9900, uploadedAt: '2026-03-11' },
  { slug: 'old-map-tweak', title: 'Old Map Tweak', uploader: 'maya.codes@gmail.com', category: 'San Andreas', status: 'unpublished', sales: 12, revenueInPaise: 12 * 8900, uploadedAt: '2025-12-05' },
];

export interface EmployeeAudit {
  email: string;
  uploadCount: number;
  totalSales: number;
  totalRevenueInPaise: number;
  lastActive: string;
  activityLog: { action: string; timestamp: string }[];
}

export const EMPLOYEE_AUDITS: EmployeeAudit[] = [
  {
    email: 'arjun.dev@gmail.com',
    uploadCount: 3,
    totalSales: 388,
    totalRevenueInPaise: 210 * 19900 + 178 * 17900,
    lastActive: '2026-07-18 10:22',
    activityLog: [
      { action: 'Uploaded Weapon Bloom FX (draft)', timestamp: '2026-07-18 10:22' },
      { action: 'Edited Night City Lighting', timestamp: '2026-06-20 15:04' },
      { action: 'Published Cyberpunk HUD Overhaul v2.3.1', timestamp: '2026-06-14 09:41' },
    ],
  },
  {
    email: 'maya.codes@gmail.com',
    uploadCount: 2,
    totalSales: 76,
    totalRevenueInPaise: 64 * 9900 + 12 * 8900,
    lastActive: '2026-03-11 12:00',
    activityLog: [
      { action: 'Published Vice City Skins Vol.2', timestamp: '2026-03-11 12:00' },
      { action: 'Uploaded Old Map Tweak', timestamp: '2025-12-05 08:30' },
    ],
  },
];

export function getRevenueSummary() {
  const totalRevenue = PLATFORM_MODS.reduce((sum, m) => sum + m.revenueInPaise, 0);
  const totalSales = PLATFORM_MODS.reduce((sum, m) => sum + m.sales, 0);
  const topMods = [...PLATFORM_MODS].sort((a, b) => b.revenueInPaise - a.revenueInPaise).slice(0, 3);
  const topEmployees = [...EMPLOYEE_AUDITS].sort((a, b) => b.totalRevenueInPaise - a.totalRevenueInPaise).slice(0, 3);
  return { totalRevenue, totalSales, topMods, topEmployees };
}

export const REVENUE_SPARKLINE = [42000, 58000, 51000, 71000, 84000, 76000, 98000, 112000, 105000, 128000, 141000, 156000];
