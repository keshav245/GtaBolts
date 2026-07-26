'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/upload', label: 'Upload mod', icon: Upload },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 hidden md:block">
      <div className="glass rounded-lg p-3 sticky top-20">
        <div className="flex items-center gap-2 px-2 py-2 mb-2 text-fog-dim">
          <Package className="w-4 h-4" />
          <span className="font-mono text-[11px] uppercase tracking-wider">Employee console</span>
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
