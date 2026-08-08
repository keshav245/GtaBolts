'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown, ShieldCheck, ListChecks, Users2, BarChart3, Tags, Youtube, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/admin', label: 'Revenue overview', icon: BarChart3 },
  { href: '/admin/roles', label: 'Role management', icon: ShieldCheck },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/videos', label: 'Featured videos', icon: Youtube },
  { href: '/admin/moderation', label: 'Mod moderation', icon: ListChecks },
  { href: '/admin/employees', label: 'Employee audit', icon: Users2 },
  { href: '/admin/users', label: 'User directory', icon: Users2 },
  { href: '/admin/settings', label: 'Contact settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 hidden md:block">
      <div className="glass rounded-lg p-3 sticky top-20">
        <div className="flex items-center gap-2 px-2 py-2 mb-2 text-violet-bright">
          <Crown className="w-4 h-4" />
          <span className="font-mono text-[11px] uppercase tracking-wider">Owner console</span>
        </div>
        <nav className="space-y-1">
          {ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                  active ? 'bg-violet/20 text-violet-bright' : 'text-fog hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
