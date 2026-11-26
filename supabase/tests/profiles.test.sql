-- Run against a disposable local Supabase database with `supabase test db`.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(8);

insert into auth.users (id, email) values
  ('10000000-0000-0000-0000-000000000001', 'one@example.test'),
  ('10000000-0000-0000-0000-000000000002', 'two@example.test');
select is((select count(*) from public.profiles where id in ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002')), 2::bigint, 'signup creates profiles');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select is((select count(*) from public.profiles where id = '10000000-0000-0000-0000-000000000002'), 1::bigint, 'profiles are readable');
with updated as (update public.profiles set display_name = 'First' where id = '10000000-0000-0000-0000-000000000001' returning id)
select is((select count(*) from updated), 1::bigint, 'user can edit own profile');
with updated as (update public.profiles set display_name = 'Changed' where id = '10000000-0000-0000-0000-000000000002' returning id)
select is((select count(*) from updated), 0::bigint, 'user cannot edit another profile');
select throws_ok($$update public.profiles set id = '10000000-0000-0000-0000-000000000002' where id = '10000000-0000-0000-0000-000000000001'$$, '42501', null, 'user cannot alter ownership');
select throws_ok($$insert into public.profiles (id) values ('10000000-0000-0000-0000-000000000003')$$, '42501', null, 'user cannot create profiles directly');
select throws_ok($$delete from public.profiles where id = '10000000-0000-0000-0000-000000000001'$$, '42501', null, 'user cannot delete profiles directly');
select throws_ok($$update public.profiles set bio = repeat('x', 161) where id = '10000000-0000-0000-0000-000000000001'$$, '23514', null, 'bio length enforced by database');
reset role;
select * from finish();
rollback;
