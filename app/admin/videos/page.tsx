import VideoManager from '@/components/admin/VideoManager';
import { getFeaturedVideos } from '@/lib/queries/videos';

export default async function AdminVideosPage() {
  const videos = await getFeaturedVideos();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Homepage showcase</p>
        <h1 className="font-display font-bold text-3xl">Featured videos</h1>
      </div>
      <VideoManager initialVideos={videos} />
    </div>
  );
}
