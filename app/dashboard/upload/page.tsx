'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import UploadDropzone from '@/components/dashboard/UploadDropzone';
import { CATEGORIES } from '@/lib/mods-data';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function UploadModPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [screenshots, setScreenshots] = useState<{ file: File; url: string }[]>([]);
  const [submitting, setSubmitting] = useState<'draft' | 'published' | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleScreenshotsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const withUrls = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setScreenshots((prev) => [...prev, ...withUrls]);
  }

  function removeScreenshot(index: number) {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(status: 'draft' | 'published') {
    setSubmitting(status);
    // TODO: upload mod file + screenshots to R2, then insert a row into the mods
    // table (status = draft|published) via a server action using supabaseAdmin.
    setTimeout(() => setSubmitting(null), 1200);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// New upload</p>
        <h1 className="font-display font-bold text-3xl">Upload a mod</h1>
      </div>

      <GlassCard className="p-6 space-y-6">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Cyberpunk HUD Overhaul"
            className="w-full glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            placeholder="cyberpunk-hud-overhaul"
            className="w-full glass rounded-md px-3 py-2.5 text-sm font-mono placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What does this mod do?"
            className="w-full glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all resize-none"
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
              placeholder="199"
              className="w-full glass rounded-md px-3 py-2.5 text-sm font-mono placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
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

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-fog-dim mb-1.5 block">Screenshots</label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {screenshots.map((s, i) => (
              <div key={i} className="relative aspect-video rounded-md overflow-hidden group">
                <Image src={s.url} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
                <button
                  onClick={() => removeScreenshot(i)}
                  className="absolute top-1 right-1 p-1 rounded bg-void/70 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove screenshot"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="aspect-video rounded-md border-2 border-dashed border-white/15 hover:border-white/30 flex items-center justify-center cursor-pointer transition-colors">
              <span className="text-2xl text-fog-dim">+</span>
              <input type="file" accept="image/*" multiple onChange={handleScreenshotsChange} className="hidden" />
            </label>
          </div>
        </div>

        <UploadDropzone label="Mod file (.zip)" accept=".zip,.rar,.7z" />

        <div className="flex gap-3 pt-2">
          <NeonButton variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting !== null}>
            {submitting === 'draft' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              'Save as draft'
            )}
          </NeonButton>
          <NeonButton onClick={() => handleSubmit('published')} disabled={submitting !== null}>
            {submitting === 'published' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
              </span>
            ) : (
              'Publish mod'
            )}
          </NeonButton>
        </div>
      </GlassCard>
    </div>
  );
}
