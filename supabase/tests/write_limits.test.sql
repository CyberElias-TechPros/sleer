begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(5);
insert into auth.users(id,email) values
  ('40000000-0000-0000-0000-000000000001','one@example.test'),
  ('40000000-0000-0000-0000-000000000002','two@example.test');
insert into public.videos(id, creator_id, caption, source_type, playback_url, status) values
  ('50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','approved','external_direct','https://example.com/video.mp4','approved');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"40000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select lives_ok($$insert into public.reports(user_id,video_id,reason) select '40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','reason' from generate_series(1,10)$$, 'ten reports allowed');
select throws_ok($$insert into public.reports(user_id,video_id,reason) values ('40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','reason')$$, 'P0001', 'SLEER_RATE_LIMIT', 'eleventh report blocked');
select throws_ok($$select * from sleer_private.write_events$$, '42501', null, 'events not accessible to clients');
select set_config('request.jwt.claims', '{"sub":"40000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select lives_ok($$insert into public.reports(user_id,video_id,reason) values ('40000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000001','reason')$$, 'another user has an independent limit');
reset role;
update sleer_private.write_events set occurred_at = clock_timestamp() - interval '2 hours' where user_id = '40000000-0000-0000-0000-000000000001' and action = 'report';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"40000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select lives_ok($$insert into public.reports(user_id,video_id,reason) values ('40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','reason')$$, 'allowance renews after the rolling window');
reset role;
select * from finish();
rollback;
