import { createClient } from '@/lib/supabase/server';

export interface RoleHolder {
  id: string;
  email: string;
  roles: string[];
}

export async function getRoleHolders(): Promise<RoleHolder[]> {
  const supabase = await createClient();

  const { data: roles } = await supabase.from('user_roles').select('user_id, role').in('role', ['employee', 'owner']);
  if (!roles || roles.length === 0) return [];

  const userIds = [...new Set(roles.map((r) => r.user_id))];
  const { data: profiles } = await supabase.from('profiles').select('id, email').in('id', userIds);
  const emailById = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  const byUser = new Map<string, RoleHolder>();
  roles.forEach((r) => {
    const email = emailById.get(r.user_id) ?? 'unknown';
    if (!byUser.has(r.user_id)) byUser.set(r.user_id, { id: r.user_id, email, roles: [] });
    byUser.get(r.user_id)!.roles.push(r.role);
  });

  return Array.from(byUser.values());
}

export interface PlatformMod {
  slug: string;
  title: string;
  uploader: string;
  category: string;
  status: string;
  sales: number;
  revenueInPaise: number;
  uploadedAt: string;
}

export async function getPlatformMods(): Promise<PlatformMod[]> {
  const supabase = await createClient();

  const { data: mods } = await supabase
    .from('mods')
    .select('id, slug, title, category, status, uploader_id, created_at')
    .order('created_at', { ascending: false });
  if (!mods) return [];

  const { data: purchases } = await supabase.from('purchases').select('mod_id, amount_in_paise').eq('status', 'completed');
  const { data: profiles } = await supabase.from('profiles').select('id, email');
  const emailById = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  return mods.map((mod) => {
    const modSales = (purchases ?? []).filter((p) => p.mod_id === mod.id);
    return {
      slug: mod.slug,
      title: mod.title,
      uploader: emailById.get(mod.uploader_id) ?? 'Unknown',
      category: mod.category,
      status: mod.status,
      sales: modSales.length,
      revenueInPaise: modSales.reduce((sum, p) => sum + p.amount_in_paise, 0),
      uploadedAt: mod.created_at.slice(0, 10),
    };
  });
}

export interface EmployeeAudit {
  email: string;
  uploadCount: number;
  totalSales: number;
  totalRevenueInPaise: number;
  lastActive: string;
  activityLog: { action: string; timestamp: string }[];
}

// There's no dedicated activity-log table in this schema, so the "activity
// log" here is derived from each mod's created/updated timestamps rather
// than a true granular audit trail (e.g. it won't show edits that didn't
// change status). Good enough for a first pass; a real audit_log table would
// be the next step if you need finer-grained history.
export async function getEmployeeAudits(): Promise<EmployeeAudit[]> {
  const supabase = await createClient();

  const { data: employeeRoles } = await supabase.from('user_roles').select('user_id').eq('role', 'employee');
  if (!employeeRoles || employeeRoles.length === 0) return [];

  const employeeIds = employeeRoles.map((r) => r.user_id);
  const { data: profiles } = await supabase.from('profiles').select('id, email').in('id', employeeIds);
  const { data: mods } = await supabase
    .from('mods')
    .select('id, title, status, uploader_id, created_at, updated_at')
    .in('uploader_id', employeeIds);
  const { data: purchases } = await supabase.from('purchases').select('mod_id, amount_in_paise').eq('status', 'completed');

  return (profiles ?? []).map((profile) => {
    const employeeMods = (mods ?? []).filter((m) => m.uploader_id === profile.id);
    const modIds = employeeMods.map((m) => m.id);
    const employeeSales = (purchases ?? []).filter((p) => modIds.includes(p.mod_id));

    const activityLog = employeeMods
      .map((m) => ({
        action: `${m.status === 'published' ? 'Published' : 'Uploaded'} ${m.title}`,
        timestamp: m.updated_at,
      }))
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
      .slice(0, 5);

    const lastActive = employeeMods.reduce(
      (latest, m) => (m.updated_at > latest ? m.updated_at : latest),
      employeeMods[0]?.updated_at ?? ''
    );

    return {
      email: profile.email,
      uploadCount: employeeMods.length,
      totalSales: employeeSales.length,
      totalRevenueInPaise: employeeSales.reduce((sum, p) => sum + p.amount_in_paise, 0),
      lastActive: lastActive ? lastActive.slice(0, 16).replace('T', ' ') : '—',
      activityLog,
    };
  });
}

export interface PlatformUser {
  id: string;
  email: string;
  roles: string[];
  joinedAt: string;
  totalSpentInPaise: number;
  purchases: { modTitle: string; date: string; priceInPaise: number }[];
}

export async function getAllUsers(): Promise<PlatformUser[]> {
  const supabase = await createClient();

  const { data: profiles } = await supabase.from('profiles').select('id, email, created_at');
  if (!profiles) return [];

  const { data: roles } = await supabase.from('user_roles').select('user_id, role');
  const { data: purchases } = await supabase
    .from('purchases')
    .select('user_id, mod_id, amount_in_paise, status, created_at')
    .eq('status', 'completed');
  const { data: mods } = await supabase.from('mods').select('id, title');
  const modTitleById = new Map((mods ?? []).map((m) => [m.id, m.title]));

  return profiles.map((profile) => {
    const userRoles = (roles ?? []).filter((r) => r.user_id === profile.id).map((r) => r.role);
    const userPurchases = (purchases ?? []).filter((p) => p.user_id === profile.id);

    return {
      id: profile.id,
      email: profile.email,
      roles: userRoles.length ? userRoles : ['user'],
      joinedAt: profile.created_at.slice(0, 10),
      totalSpentInPaise: userPurchases.reduce((sum, p) => sum + p.amount_in_paise, 0),
      purchases: userPurchases.map((p) => ({
        modTitle: modTitleById.get(p.mod_id) ?? 'Unknown mod',
        date: p.created_at.slice(0, 10),
        priceInPaise: p.amount_in_paise,
      })),
    };
  });
}

export async function getRevenueSummary() {
  const [mods, employees] = await Promise.all([getPlatformMods(), getEmployeeAudits()]);

  const totalRevenue = mods.reduce((sum, m) => sum + m.revenueInPaise, 0);
  const totalSales = mods.reduce((sum, m) => sum + m.sales, 0);
  const activeMods = mods.filter((m) => m.status === 'published').length;
  const topMods = [...mods].sort((a, b) => b.revenueInPaise - a.revenueInPaise).slice(0, 3);
  const topEmployees = [...employees].sort((a, b) => b.totalRevenueInPaise - a.totalRevenueInPaise).slice(0, 3);

  return { totalRevenue, totalSales, activeMods, topMods, topEmployees };
}
