export interface DashboardMod {
  slug: string;
  title: string;
  category: string;
  priceInPaise: number;
  status: 'draft' | 'published';
  views: number;
  sales: number;
  revenueInPaise: number;
  updatedAt: string;
}

export const EMPLOYEE_MODS: DashboardMod[] = [
  {
    slug: 'cyberpunk-hud',
    title: 'Cyberpunk HUD Overhaul',
    category: 'GTA V',
    priceInPaise: 19900,
    status: 'published',
    views: 15230,
    sales: 210,
    revenueInPaise: 210 * 19900,
    updatedAt: '2026-06-14',
  },
  {
    slug: 'night-city-lighting',
    title: 'Night City Lighting',
    category: 'GTA V',
    priceInPaise: 17900,
    status: 'published',
    views: 12040,
    sales: 178,
    revenueInPaise: 178 * 17900,
    updatedAt: '2026-01-30',
  },
  {
    slug: 'weapon-bloom-fx',
    title: 'Weapon Bloom FX',
    category: 'GTA Online',
    priceInPaise: 12900,
    status: 'draft',
    views: 0,
    sales: 0,
    revenueInPaise: 0,
    updatedAt: '2026-07-18',
  },
];

export const VIEWS_SPARKLINE = [820, 940, 890, 1100, 1250, 1180, 1400, 1620, 1510, 1720, 1890, 2040];
export const SALES_SPARKLINE = [4, 6, 5, 8, 9, 7, 11, 13, 10, 14, 16, 18];
export const REVENUE_SPARKLINE = [8000, 12000, 9500, 16000, 18000, 14000, 22000, 26000, 20000, 28000, 32000, 36000];

export function getEmployeeSummary() {
  const totalViews = EMPLOYEE_MODS.reduce((sum, m) => sum + m.views, 0);
  const totalSales = EMPLOYEE_MODS.reduce((sum, m) => sum + m.sales, 0);
  const totalRevenue = EMPLOYEE_MODS.reduce((sum, m) => sum + m.revenueInPaise, 0);
  return { totalViews, totalSales, totalRevenue };
}
