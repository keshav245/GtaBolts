import { createClient } from '@supabase/supabase-js';

// CRITICAL: this client bypasses RLS entirely. Only ever import it with a
// dynamic import inside a server action / route handler, never at module
// top-level in shared code, and never in anything that could run client-side:
//
//   const { supabaseAdmin } = await import('@/lib/supabase/admin');
//
// This keeps the service role key out of any bundle that could reach the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
