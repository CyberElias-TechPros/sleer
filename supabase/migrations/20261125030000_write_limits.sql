-- Defense in depth, not a replacement for gateway/IP rate limiting or billing alerts.
-- Successful inserts consume a rolling per-user allowance. Delete/re-insert churn
-- also consumes allowance. The event table is inaccessible to application roles.
create schema if not exists sleer_private;
revoke all on schema sleer_private from public, anon, authenticated;
create table sleer_private.write_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  occurred_at timestamptz not null default clock_timestamp()
);
create index write_events_window on sleer_private.write_events(user_id, action, occurred_at);
revoke all on sleer_private.write_events from public, anon, authenticated;

create function sleer_private.enforce_write_limit() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  action_name text;
  max_count integer;
  window_length interval;
  window_now timestamptz;
  used_count bigint;
begin
  -- Trusted administrative/database maintenance has no end-user JWT.
  if actor is null then return new; end if;
  if tg_table_schema = 'storage' and tg_table_name = 'objects' then
    if new.bucket_id <> 'creator-videos' then return new; end if;
    action_name := 'video_upload'; max_count := 10; window_length := interval '24 hours';
  elsif tg_table_schema = 'public' and tg_table_name = 'comments' then
    action_name := 'comment'; max_count := 30; window_length := interval '1 hour';
  elsif tg_table_schema = 'public' and tg_table_name = 'reports' then
    action_name := 'report'; max_count := 10; window_length := interval '1 hour';
  elsif tg_table_schema = 'public' and tg_table_name = 'follows' then
    action_name := 'follow'; max_count := 60; window_length := interval '1 hour';
  elsif tg_table_schema = 'public' and tg_table_name = 'likes' then
    action_name := 'like'; max_count := 120; window_length := interval '1 hour';
  elsif tg_table_schema = 'public' and tg_table_name = 'bookmarks' then
    action_name := 'bookmark'; max_count := 120; window_length := interval '1 hour';
  else
    raise exception 'Unexpected write-limit trigger target';
  end if;

  -- Serialize writes for this user/action so concurrent requests cannot both
  -- observe the same remaining allowance. Locks are released on transaction end.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(actor::text || ':' || action_name, 0));
  window_now := clock_timestamp();
  delete from sleer_private.write_events where user_id = actor and action = action_name and occurred_at <= window_now - window_length;
  select count(*) into used_count from sleer_private.write_events
    where user_id = actor and action = action_name and occurred_at > window_now - window_length;
  if used_count >= max_count then
    raise exception using errcode = 'P0001', message = 'SLEER_RATE_LIMIT';
  end if;
  insert into sleer_private.write_events(user_id, action, occurred_at) values (actor, action_name, window_now);
  return new;
end;
$$;
revoke all on function sleer_private.enforce_write_limit() from public, anon, authenticated;
create trigger limit_sleer_uploads before insert on storage.objects for each row execute function sleer_private.enforce_write_limit();
create trigger limit_sleer_comments before insert on public.comments for each row execute function sleer_private.enforce_write_limit();
create trigger limit_sleer_reports before insert on public.reports for each row execute function sleer_private.enforce_write_limit();
create trigger limit_sleer_follows before insert on public.follows for each row execute function sleer_private.enforce_write_limit();
create trigger limit_sleer_likes before insert on public.likes for each row execute function sleer_private.enforce_write_limit();
create trigger limit_sleer_bookmarks before insert on public.bookmarks for each row execute function sleer_private.enforce_write_limit();
