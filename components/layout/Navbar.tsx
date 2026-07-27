'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Search, User, ShoppingBag, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import NeonButton from '@/components/ui/NeonButton';

const NAV_LINKS = [
  { href: '/browse', label: 'Browse' },
  { href: '/category/gta-v', label: 'GTA V' },
  { href: '/category/gta-online', label: 'GTA Online' },
];

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoaded(true);
    });

    // Keeps the navbar in sync immediately after sign-in/sign-out,
    // without needing a full page reload.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-display font-bold text-xl tracking-tight text-gradient shrink-0">
          GTA<span className="text-white">Mods</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-fog hover:text-white transition-colors rounded-md hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fog-dim" />
            <input
              type="text"
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
