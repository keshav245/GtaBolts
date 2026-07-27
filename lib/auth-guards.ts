import { redirect } from 'next/navigation';
import { createClient, getUser } from '@/lib/supabase/server';

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect('/auth');
  return user;
}

// role: 'employee' also passes for owners, since owners can do everything
// employees can. role: 'owner' only passes for owners.
export async function requireRole(role: 'employee' | 'owner') {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
  const roles = (data ?? []).map((r) => r.role as string);

  const hasAccess = roles.includes(role) || roles.includes('owner');
  if (!hasAccess) redirect('/');

  return user;
}
