import { Play } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { getYouTubeThumbnail, getYouTubeWatchUrl } from '@/lib/youtube';
import { FeaturedVideo } from '@/lib/queries/videos';

export default function FeaturedVideos({ videos }: { videos: FeaturedVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl">Watch it in action</h2>
        <span className="font-mono text-xs text-violet-bright uppercase tracking-wider">Community showcase</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <a
            key={video.id}
            href={getYouTubeWatchUrl(video.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlassCard reticle className="group overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={getYouTubeThumbnail(video.youtubeId)}
                  alt={video.title ?? 'Featured video'}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-void/30 group-hover:bg-void/50 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-void/60 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:border-violet-bright/60 group-hover:shadow-glow-violet transition-all">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              {video.title && (
                <div className="p-3">
                  <h3 className="font-display font-semibold text-sm truncate group-hover:text-violet-bright transition-colors">
                    {video.title}
                  </h3>
                </div>
              )}
            </GlassCard>
          </a>
        ))}
      </div>
    </section>
  );
}
