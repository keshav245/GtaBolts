'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth-guards';
import { extractYouTubeId } from '@/lib/youtube';

export async function addFeaturedVideo(youtubeUrl: string, title: string) {
  await requireRole('owner');

  const videoId = extractYouTubeId(youtubeUrl.trim());
  if (!videoId) {
    return { ok: false, message: "That doesn't look like a valid YouTube link." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('featured_videos').insert({
    youtube_id: videoId,
    title: title.trim() || null,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath('/');
  revalidatePath('/admin/videos');
  return { ok: true, message: 'Video added.' };
}

export async function deleteFeaturedVideo(id: string) {
  await requireRole('owner');
  const supabase = await createClient();

  const { error } = await supabase.from('featured_videos').delete().eq('id', id);
  if (error) return { ok: false, message: error.message };

  revalidatePath('/');
  revalidatePath('/admin/videos');
  return { ok: true, message: 'Video removed.' };
}
