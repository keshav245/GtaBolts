'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Search, User, ShoppingBag, LogOut, Crown, Wrench } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import NeonButton from '@/components/ui/NeonButton';
import CategoryDropdown from '@/components/layout/CategoryDropdown';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadUserAndRoles() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: roleRows } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id);
        setRoles((roleRows ?? []).map((r) => r.role as string));
      } else {
        setRoles([]);
      }

      setLoaded(true);
    }

    loadUserAndRoles();

    // Keeps the navbar in sync immediately after sign-in/sign-out,
    // without needing a full page reload.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setRoles([]);
      else loadUserAndRoles();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const isOwner = roles.includes('owner');
  const isEmployee = roles.includes('employee');

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-gradient">
            GTA<span className="text-white">Bolts</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/browse"
            className="px-3 py-2 text-sm text-fog hover:text-white transition-colors rounded-md hover:bg-white/5"
          >
            Browse
          </Link>
          <CategoryDropdown />
        </nav>

        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fog-dim" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              placeholder="Search mods, categories..."
              className="w-full glass rounded-md pl-9 pr-3 py-2 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/library" className="p-2 text-fog hover:text-cyan transition-colors" aria-label="Your library">
            <ShoppingBag className="w-5 h-5" />
          </Link>

          {!loaded ? (
            // Reserve space to avoid a layout flash before auth state resolves
            <div className="w-20 h-8" />
          ) : user ? (
            <>
              {isOwner && (
                <Link href="/admin">
                  <NeonButton size="sm" variant="secondary" className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" /> Admin
                  </NeonButton>
                </Link>
              )}
              {!isOwner && isEmployee && (
                <Link href="/dashboard">
                  <NeonButton size="sm" variant="secondary" className="flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> Dashboard
                  </NeonButton>
                </Link>
              )}

              <span className="text-xs font-mono text-fog-dim max-w-[140px] truncate" title={user.email ?? ''}>
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="p-2 text-fog hover:text-alert transition-colors"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="p-2 text-fog hover:text-violet-bright transition-colors" aria-label="Account">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/auth">
                <NeonButton size="sm">Sign in</NeonButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
