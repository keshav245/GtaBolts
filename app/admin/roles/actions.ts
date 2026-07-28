'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';

type Role = 'employee' | 'owner';

interface ActionResult {
  ok: boolean;
  code: 'granted' | 'revoked' | 'user_not_found' | 'already_has_role' | 'error';
  message: string;
}

export async function grantRoleAction(email: string, role: Role): Promise<ActionResult> {
  await requireRole('owner');
  const supabase = await createClient();

  const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();

  if (!profile) {
    // No pending_role_grants table exists in this schema — being upfront that
    // this doesn't queue anything, unlike the earlier UI mockup implied.
    return {
      ok: false,
      code: 'user_not_found',
      message: `${email} hasn't signed up yet. Ask them to create an account first, then grant the role.`,
    };
  }

  const { data: existing } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', profile.id)
    .eq('role', role)
    .maybeSingle();

  if (existing) {
    return { ok: false, code: 'already_has_role', message: `${email} already has the ${role} role.` };
  }

  const { error } = await supabase.from('user_roles').insert({ user_id: profile.id, role });
  if (error) {
    return { ok: false, code: 'error', message: error.message };
  }

  revalidatePath('/admin/roles');
  return { ok: true, code: 'granted', message: `Granted ${role} role to ${email}.` };
}

export async function revokeRoleAction(userId: string, email: string, role: Role): Promise<ActionResult> {
  await requireRole('owner');
  const supabase = await createClient();

  const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', role);
  if (error) {
    return { ok: false, code: 'error', message: error.message };
  }

  revalidatePath('/admin/roles');
  return { ok: true, code: 'revoked', message: `Revoked ${role} role from ${email}.` };
}
