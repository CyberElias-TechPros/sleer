begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(14);
insert into auth.users(id, email) values ('20000000-0000-0000-0000-000000000001', 'one@example.test'), ('20000000-0000-0000-0000-000000000002', 'two@example.test');
insert into public.videos (id, creator_id, caption, source_type, playback_url, status) values
 ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'approved', 'external_direct', 'https://example.com/video.mp4', 'approved'),
 ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'pending', 'external_direct', 'https://example.com/private.mp4', 'pending');
set local role anon;
select is((select count(*) from public.videos), 1::bigint, 'anonymous sees only approved videos');
select throws_ok($$insert into public.likes (user_id, video_id) values ('20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001')$$, '42501', null, 'anonymous cannot like');
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select is((select count(*) from public.videos), 1::bigint, 'other users pending videos are hidden');
select lives_ok($$insert into public.likes (user_id, video_id) values ('20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001')$$, 'user can like approved video');
select throws_ok($$insert into public.likes (user_id, video_id) values ('20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001')$$, '42501', null, 'cannot impersonate another user');
select throws_ok($$insert into public.likes (user_id, video_id) values ('20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002')$$, '42501', null, 'cannot like pending video');
select throws_ok($$update public.videos set status = 'approved' where id = '30000000-0000-0000-0000-000000000002'$$, '42501', null, 'client cannot approve videos');
select throws_ok($$insert into public.videos (creator_id, creator_name, caption, category, creator_asserted_rights, source_type, storage_path) values ('20000000-0000-0000-0000-000000000001','test','test','General',true,'uploaded','20000000-0000-0000-0000-000000000002/30000000-0000-0000-0000-000000000003.mp4')$$, '42501', null, 'cannot submit another users storage path');
select lives_ok($$insert into public.videos (creator_id, creator_name, caption, category, creator_asserted_rights, source_type, storage_path) values ('20000000-0000-0000-0000-000000000001','test','test','General',true,'uploaded','20000000-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000003.mp4')$$, 'can submit own path as pending');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('creator-videos', '20000000-0000-0000-0000-000000000002/30000000-0000-0000-0000-000000000003.mp4')$$, '42501', null, 'cannot upload into another user folder');
select lives_ok($$insert into storage.objects (bucket_id, name) values ('creator-videos', '20000000-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000003.mp4')$$, 'can upload into own folder');
select throws_ok($$select * from public.reports$$, '42501', null, 'reports are not readable by clients');
select throws_ok($$insert into public.videos (creator_id, creator_name, caption, category, creator_asserted_rights, source_type, storage_path) values ('20000000-0000-0000-0000-000000000001','test','test','General',false,'uploaded','20000000-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000004.mp4')$$, '42501', null, 'submission requires rights assertion');
select throws_ok($$insert into public.comments (user_id, video_id, body, created_at) values ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'test', '2000-01-01')$$, '42501', null, 'client cannot forge interaction timestamps');
reset role;
select * from finish();
rollback;
