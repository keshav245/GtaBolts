'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { CATEGORIES } from '@/lib/categories';
import { updateModDetails } from './actions';

interface EditModFormProps {
  slug: string;
  initialTitle: string;
  initialDescription: string;
  initialCategory: string;
  initialPriceInPaise: number;
}

export default function EditModForm({
  slug,
  initialTitle,
  initialDescription,
  initialCategory,
  initialPriceInPaise,
}: EditModFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState(String(initialPriceInPaise / 100));
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title || !price) {
      showToast('warning', 'Title and price are required.');
      return;
    }

    setSaving(true);
    const result = await updateModDetails(slug, {
      title,
      description,
      category,
      priceInPaise: Math.round(Number(price) * 100),
    });
    setSaving(false);

    if (result.ok) {
      showToast('success', result.message);
      router.push('/dashboard');
      router.refresh();
    } else {
      showToast('error', result.message);
    }
  }

  return (
    <GlassCard className="p-6 space-y-6 max-w-2xl">
      <p className="text-xs text-fog-dim">
        Slug, screenshots, and the mod file can&apos;t be changed here yet — only metadata. Contact support if you need
        the mod file replaced.
      </p>

      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full glass rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full glass rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Price (₹)</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full glass rounded-md px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full glass rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-violet/50 transition-all"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name} className="bg-ink">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <NeonButton onClick={handleSave} disabled={saving}>
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </span>
          ) : (
            'Save changes'
          )}
        </NeonButton>
        <NeonButton variant="ghost" onClick={() => router.push('/dashboard')}>
          Cancel
        </NeonButton>
      </div>
    </GlassCard>
  );
}
