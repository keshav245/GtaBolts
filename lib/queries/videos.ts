import { createClient } from '@/lib/supabase/server';

export interface FeaturedVideo {
  id: string;
  youtubeId: string;
  title: string | null;
}

export async function getFeaturedVideos(): Promise<FeaturedVideo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('featured_videos')
    .select('id, youtube_id, title')
    .order('created_at', { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    youtubeId: row.youtube_id,
    title: row.title,
  }));
}
