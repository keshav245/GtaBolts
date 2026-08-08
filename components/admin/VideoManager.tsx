'use client';

import { useState } from 'react';
import { Youtube, Trash2, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useToast } from '@/components/ui/ToastProvider';
import { getYouTubeThumbnail } from '@/lib/youtube';
import { FeaturedVideo } from '@/lib/queries/videos';
import { addFeaturedVideo, deleteFeaturedVideo } from '@/app/admin/videos/actions';

export default function VideoManager({ initialVideos }: { initialVideos: FeaturedVideo[] }) {
  const { showToast } = useToast();
  const [videos, setVideos] = useState(initialVideos);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd() {
    if (!url.trim()) return;
    setSubmitting(true);
    const result = await addFeaturedVideo(url, title);
    setSubmitting(false);

    if (result.ok) {
      showToast('success', result.message);
      setUrl('');
      setTitle('');
      // revalidatePath refreshes server data on next navigation, but since
      // we're staying on this client component, refetch isn't automatic —
      // simplest fix is a full reload of just this list via router.refresh()
      // equivalent: just re-derive optimistically isn't possible without the
      // real id, so we ask the page to refresh.
      window.location.reload();
    } else {
      showToast('error', result.message);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteFeaturedVideo(id);
    setDeletingId(null);

    if (result.ok) {
      setVideos((prev) => prev.filter((v) => v.id !== id));
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard strong className="p-4">
        <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-3">Add video</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube link..."
            className="flex-1 glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="sm:w-56 glass rounded-md px-3 py-2.5 text-sm placeholder:text-fog-dim focus:outline-none focus:border-violet/50 focus:shadow-glow-sm transition-all"
          />
          <NeonButton onClick={handleAdd} disabled={submitting || !url.trim()}>
            <span className="flex items-center gap-1.5">
              <Youtube className="w-4 h-4" /> {submitting ? 'Adding...' : 'Add'}
            </span>
          </NeonButton>
        </div>
      </GlassCard>

      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-fog-dim mb-3">Featured videos</p>
        {videos.length === 0 ? (
          <p className="text-sm text-fog-dim">No videos yet — paste a YouTube link above.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((video) => (
              <GlassCard key={video.id} className="overflow-hidden group">
                <div className="relative aspect-video">
                  <img src={getYouTubeThumbnail(video.youtubeId)} alt={video.title ?? 'Video thumbnail'} className="absolute inset-0 w-full h-full object-cover" />
                  <button
                    onClick={() => handleDelete(video.id)}
                    disabled={deletingId === video.id}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-void/70 backdrop-blur-sm text-fog-dim hover:text-alert opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove video"
                  >
                    {deletingId === video.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
                <p className="px-3 py-2 text-xs text-fog truncate">{video.title || 'Untitled'}</p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
