'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, ImagePlus } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { uploadToR2 } from '@/lib/upload-client';
import { createCategory, deleteCategory } from '@/app/admin/categories/actions';

export interface CategoryWithCount {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  modCount: number;
}

export default function CategoryManager({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
  const { showToast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleCreate() {
    if (!name.trim()) {
      showToast('warning', 'Category name is required.');
      return;
    }
    setCreating(true);

    let imageKey: string | null = null;
    if (imageFile) {
      try {
        const result = await uploadToR2(imageFile, 'category');
        imageKey = result.key;
      } catch {
        showToast('error', 'Failed to upload category photo.');
        setCreating(false);
        return;
      }
    }

    const result = await createCategory(name.trim(), imageKey);
    setCreating(false);

    if (result.ok) {
      showToast('success', result.message);
      setName('');
      setImageFile(null);
      setImagePreview(null);
      // The new category's real id/slug/signed image URL aren't known
      // client-side without a refetch — a reload is the simplest correct way
      // to pick those up rather than faking a row with incomplete data.
      window.location.reload();
    } else {
      showToast('error', result.message);
    }
  }

  async function handleDelete(id: string, catName: string) {
    setDeletingId(id);
    const result = await deleteCategory(id, catName);
    setDeletingId(null);

    if (result.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  }

  return (
    <div className="space-y-8">
      <GlassCard strong className="p-5">
        <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-3">Add category</p>
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <label className="relative w-20 h-20 rounded-md border-2 border-dashed border-white/15 hover:border-white/30 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 transition-colors bg-black/40">
            {imagePreview ? (
              <img src={imagePreview} alt="Category preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <ImagePlus className="w-5 h-5 text-fog-dim" />
            )}
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="e.g. Red Dead Redemption 2"
            className="flex-1 glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all w-full"
          />

          <NeonButton onClick={handleCreate} disabled={creating}>
            {creating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </span>
            )}
          </NeonButton>
        </div>
      </GlassCard>

      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-3">Existing categories</p>
        {categories.length === 0 ? (
          <p className="text-sm text-fog-dim">No categories yet — add one above.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <GlassCard key={cat.id} className="overflow-hidden">
                <div className="relative aspect-video bg-black/40">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-fog-dim text-[11px] font-mono">
                      No photo
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-sm truncate">{cat.name}</p>
                    <p className="font-mono text-[11px] text-fog-dim">{cat.modCount} mods</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deletingId === cat.id}
                    className="p-1.5 rounded-md text-fog-dim hover:text-alert hover:bg-alert/10 transition-colors shrink-0"
                    aria-label={`Delete ${cat.name}`}
                    title={cat.modCount > 0 ? "Can't delete — mods still use this category" : 'Delete category'}
                  >
                    {deletingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
