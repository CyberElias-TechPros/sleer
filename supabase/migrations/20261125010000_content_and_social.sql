-- Video references, not binaries. Only trusted administrators approve content.
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles(id) on delete set null,
  creator_name text not null default 'Creator' check (char_length(creator_name) between 1 and 80),
  caption text not null check (char_length(btrim(caption)) between 1 and 220),
  category text not null default 'General' check (char_length(category) between 1 and 40),
  attribution text not null default '' check (char_length(attribution) <= 300),
  creator_asserted_rights boolean not null default false,
  source_type text not null check (source_type in ('external_direct', 'uploaded')),
  playback_url text,
  storage_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  check ((source_type = 'external_direct' and playback_url ~ '^https://' and storage_path is null)
      or (source_type = 'uploaded' and playback_url is null and storage_path is not null))
);
create index videos_storage_idx on public.videos (storage_path) where storage_path is not null;
create index videos_feed_idx on public.videos (created_at desc, id desc) where status = 'approved';
alter table public.videos enable row level security;
revoke all on public.videos from anon, authenticated;
grant select on public.videos to anon, authenticated;
grant insert (creator_id, creator_name, caption, category, attribution, creator_asserted_rights, source_type, storage_path) on public.videos to authenticated;
create policy "Approved videos or own submissions" on public.videos for select to anon, authenticated
  using (status = 'approved' or creator_id = (select auth.uid()));
create policy "Submit own pending uploads" on public.videos for insert to authenticated
  with check (creator_id = (select auth.uid()) and status = 'pending' and creator_asserted_rights and source_type = 'uploaded'
    and split_part(storage_path, '/', 1) = (select auth.uid())::text
    and storage_path ~ '^[0-9a-f-]+/[0-9a-f-]+\.mp4$');

create table public.likes (user_id uuid not null references public.profiles(id) on delete cascade, video_id uuid not null references public.videos(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id, video_id));
create table public.bookmarks (user_id uuid not null references public.profiles(id) on delete cascade, video_id uuid not null references public.videos(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id, video_id));
create table public.follows (user_id uuid not null references public.profiles(id) on delete cascade, creator_id uuid not null references public.profiles(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id, creator_id), check(user_id <> creator_id));
create table public.comments (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, video_id uuid not null references public.videos(id) on delete cascade, body text not null check(char_length(btrim(body)) between 1 and 500), created_at timestamptz not null default now());
create index comments_video_idx on public.comments(video_id, created_at desc);
create table public.reports (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, video_id uuid not null references public.videos(id) on delete cascade, reason text not null check(char_length(btrim(reason)) between 1 and 500), created_at timestamptz not null default now());

alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.follows enable row level security;
alter table public.comments enable row level security;
alter table public.reports enable row level security;
revoke all on public.likes, public.bookmarks, public.follows, public.comments, public.reports from anon, authenticated;
grant select, insert, delete on public.likes, public.bookmarks, public.follows, public.comments to authenticated;
grant select on public.likes, public.comments to anon;
grant insert on public.reports to authenticated;

create policy "Likes visible for approved videos" on public.likes for select to anon, authenticated using (exists (select 1 from public.videos v where v.id = video_id and v.status = 'approved'));
create policy "Like approved videos" on public.likes for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.videos v where v.id = video_id and v.status = 'approved'));
create policy "Delete own likes" on public.likes for delete to authenticated using (user_id = (select auth.uid()));
create policy "Read own bookmarks" on public.bookmarks for select to authenticated using (user_id = (select auth.uid()));
create policy "Bookmark approved videos" on public.bookmarks for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.videos v where v.id = video_id and v.status = 'approved'));
create policy "Delete own bookmarks" on public.bookmarks for delete to authenticated using (user_id = (select auth.uid()));
create policy "Read own follows" on public.follows for select to authenticated using (user_id = (select auth.uid()));
create policy "Create own follows" on public.follows for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Delete own follows" on public.follows for delete to authenticated using (user_id = (select auth.uid()));
create policy "Read comments on approved videos" on public.comments for select to anon, authenticated using (exists (select 1 from public.videos v where v.id = video_id and v.status = 'approved'));
create policy "Comment on approved videos" on public.comments for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.videos v where v.id = video_id and v.status = 'approved'));
create policy "Delete own comments" on public.comments for delete to authenticated using (user_id = (select auth.uid()));
create policy "Report approved videos" on public.reports for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.videos v where v.id = video_id and v.status = 'approved'));

-- Private bucket: pending content is never public. Approved content uses short-lived signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('creator-videos', 'creator-videos', false, 15728640, array['video/mp4'])
on conflict (id) do update set public = false, file_size_limit = 15728640, allowed_mime_types = array['video/mp4'];
create policy "Upload into own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'creator-videos' and (storage.foldername(name))[1] = (select auth.uid())::text and name ~ '^[0-9a-f-]+/[0-9a-f-]+\.mp4$');
create policy "Read own or approved uploads" on storage.objects for select to anon, authenticated
  using (bucket_id = 'creator-videos' and ((storage.foldername(name))[1] = (select auth.uid())::text
    or exists (select 1 from public.videos v where v.storage_path = name and v.source_type = 'uploaded' and v.status = 'approved')));
create policy "Remove own unapproved uploads" on storage.objects for delete to authenticated
  using (bucket_id = 'creator-videos' and (storage.foldername(name))[1] = (select auth.uid())::text
    and not exists (select 1 from public.videos v where v.storage_path = name and v.status = 'approved'));
