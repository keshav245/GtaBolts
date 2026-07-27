import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const explicitNext = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      let destination = explicitNext ?? '/';

      if (!explicitNext) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
          const roleNames = (roles ?? []).map((r) => r.role as string);
          if (roleNames.includes('owner')) destination = '/admin';
          else if (roleNames.includes('employee')) destination = '/dashboard';
        }
      }

      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}
