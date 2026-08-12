'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { uploadToR2 } from '@/lib/upload-client';
import { updateModDetails } from '@/app/dashboard/edit/[slug]/actions';

interface ExistingScreenshot {
  key: string;
  url: string;
}

interface NewScreenshot {
  file: File;
  previewUrl: string;
  key: string | null;
  uploading: boolean;
}

interface EditModFormProps {
  slug: string;
  initialTitle: string;
  initialDescription: string;
  initialCategory: string;
  initialPriceInPaise: number;
  initialScreenshots: ExistingScreenshot[];
  categories: { slug: string; name: string }[];
}

export default function EditModForm({
  slug,
  initialTitle,
  initialDescription,
  initialCategory,
  initialPriceInPaise,
  initialScreenshots,
  categories,
}: EditModFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState(String(initialPriceInPaise / 100));
  const [existingScreenshots, setExistingScreenshots] = useState(initialScreenshots);
  const [newScreenshots, setNewScreenshots] = useState<NewScreenshot[]>([]);
  const [saving, setSaving] = useState(false);

  function removeExisting(key: string) {
    setExistingScreenshots((prev) => prev.filter((s) => s.key !== key));
  }

  function removeNew(file: File) {
    setNewScreenshots((prev) => prev.filter((s) => s.file !== file));
  }

  function handleAddScreenshots(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const items: NewScreenshot[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      key: null,
      uploading: true,
    }));
    setNewScreenshots((prev) => [...prev, ...items]);

    items.forEach((item) => {
      uploadToR2(item.file, 'screenshot')
        .then(({ key }) => {
          setNewScreenshots((prev) => prev.map((s) => (s.file === item.file ? { ...s, key, uploading: false } : s)));
        })
        .catch(() => {
          showToast('error', `Failed to upload ${item.file.name}.`);
          setNewScreenshots((prev) => prev.filter((s) => s.file !== item.file));
        });
    });
  }

  async function handleSave() {
    if (!title || !price) {
      showToast('warning', 'Title and price are required.');
      return;
    }
    if (newScreenshots.some((s) => s.uploading)) {
      showToast('warning', 'Screenshots are still uploading — wait a moment and try again.');
      return;
    }

    const screenshotKeys = [
      ...existingScreenshots.map((s) => s.key),
      ...newScreenshots.map((s) => s.key!).filter(Boolean),
    ];

    setSaving(true);
    const result = await updateModDetails(slug, {
      title,
      description,
      category,
      priceInPaise: Math.round(Number(price) * 100),
      screenshotKeys,
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
        The mod file itself can&apos;t be replaced here yet — only metadata and screenshots. Contact support if you need
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
            {categories.map((c) => (
              <option key={c.slug} value={c.name} className="bg-ink">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Screenshots</label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {existingScreenshots.map((s) => (
            <div key={s.key} className="relative aspect-video rounded-md overflow-hidden group bg-black/40">
              <img src={s.url} alt="Existing screenshot" className="absolute inset-0 w-full h-full object-contain" />
              <button
                onClick={() => removeExisting(s.key)}
                className="absolute top-1 right-1 p-1 rounded bg-void/70 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove screenshot"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {newScreenshots.map((s, i) => (
            <div key={i} className="relative aspect-video rounded-md overflow-hidden group bg-black/40">
              <img src={s.previewUrl} alt={`New screenshot ${i + 1}`} className="absolute inset-0 w-full h-full object-contain" />
              {s.uploading && (
                <div className="absolute inset-0 bg-void/60 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan" />
                </div>
              )}
              <button
                onClick={() => removeNew(s.file)}
                className="absolute top-1 right-1 p-1 rounded bg-void/70 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove screenshot"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <label className="aspect-video rounded-md border-2 border-dashed border-white/15 hover:border-white/30 flex items-center justify-center cursor-pointer transition-colors">
            <span className="text-2xl text-fog-dim">+</span>
            <input type="file" accept="image/*" multiple onChange={handleAddScreenshots} className="hidden" />
          </label>
        </div>
        {existingScreenshots.length === 0 && newScreenshots.length === 0 && (
          <p className="text-xs text-fog-dim">No screenshots — add at least one.</p>
        )}
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
