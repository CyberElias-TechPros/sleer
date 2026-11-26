import { supabase } from './auth/client';
import { Video } from './feed';
import { searchPattern } from './search';

export const PAGE_SIZE = 20;
type Row = { id: string; creator_id: string | null; creator_name: string; caption: string; category: string; attribution: string; source_type: 'external_direct' | 'uploaded'; playback_url: string | null; storage_path: string | null };

export async function loadFeed(offset: number, category?: string, search?: string, followingUserId?: string, savedUserId?: string): Promise<Video[]> {
  if (!supabase) return [];
  let query = supabase.from('videos').select('id,creator_id,creator_name,caption,category,attribution,source_type,playback_url,storage_path').eq('status', 'approved').order('created_at', { ascending: false }).order('id', { ascending: false });
  if (followingUserId) {
    const { data: follows, error: followError } = await supabase.from('follows').select('creator_id').eq('user_id', followingUserId);
    if (followError) throw followError;
    const ids = (follows ?? []).map(row => row.creator_id);
    if (!ids.length) return [];
    query = query.in('creator_id', ids);
  }
  if (savedUserId) {
    const { data: bookmarks, error: bookmarkError } = await supabase.from('bookmarks').select('video_id').eq('user_id', savedUserId);
    if (bookmarkError) throw bookmarkError;
    const ids = (bookmarks ?? []).map(row => row.video_id);
    if (!ids.length) return [];
    query = query.in('id', ids);
  }
  if (category && category !== 'All') query = query.eq('category', category);
  // Do not turn a query made solely of wildcard syntax into an unrestricted feed.
  if (search?.trim()) {
    const pattern = searchPattern(search);
    if (!pattern) return [];
    query = query.ilike('caption', pattern);
  }
  const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);
  if (error) throw error;
  return ((data ?? []) as Row[]).map(row => ({ id: row.id, creatorId: row.creator_id, url: row.playback_url ?? '', storagePath: row.storage_path, creator: row.creator_name, caption: row.caption, category: row.category, attribution: row.attribution }));
}

export async function resolveVideoUrl(video: Video): Promise<string> {
  if (!video.storagePath) return video.url;
  if (!supabase) throw new Error('Storage is not configured');
  const { data, error } = await supabase.storage.from('creator-videos').createSignedUrl(video.storagePath, 3600);
  if (error || !data?.signedUrl) throw error ?? new Error('Video unavailable');
  return data.signedUrl;
}
