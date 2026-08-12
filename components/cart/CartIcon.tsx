'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CartIcon() {
  const supabase = createClient();
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function loadCount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setCount(0);
        return;
      }
      const { count: itemCount } = await supabase
        .from('cart_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setCount(itemCount ?? 0);
    }

    loadCount();
  }, [supabase, pathname]);

  return (
    <Link href="/cart" className="relative p-2 text-fog hover:text-violet-bright transition-colors" aria-label="Cart">
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-bright text-void text-[10px] font-bold flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
