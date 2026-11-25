-- Defense in depth: clients cannot supply IDs or timestamps for interactions.
-- Existing role-specific SELECT/DELETE grants and RLS policies remain unchanged.
revoke all on public.profiles, public.videos, public.likes, public.bookmarks,
  public.follows, public.comments, public.reports from public;
revoke insert on public.likes, public.bookmarks, public.follows, public.comments, public.reports from authenticated;
grant insert (user_id, video_id) on public.likes, public.bookmarks to authenticated;
grant insert (user_id, creator_id) on public.follows to authenticated;
grant insert (user_id, video_id, body) on public.comments to authenticated;
grant insert (user_id, video_id, reason) on public.reports to authenticated;
