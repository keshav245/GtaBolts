'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface CategoryOption {
  slug: string;
  name: string;
}

export default function CategoryDropdown() {
  const supabase = createClient();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from('categories')
      .select('slug, name')
      .order('name')
      .then(({ data }) => setCategories(data ?? []));
  }, [supabase]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors',
          open ? 'text-white bg-white/5' : 'text-fog hover:text-white hover:bg-white/5'
        )}
      >
        Categories
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 glass-strong rounded-lg overflow-hidden min-w-[200px] shadow-glow-sm"
          >
            {categories.length === 0 ? (
              <p className="px-4 py-3 text-xs text-fog-dim">No categories yet.</p>
            ) : (
              <div className="py-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm text-fog hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
