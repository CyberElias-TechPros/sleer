import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

// Fast PostgreSQL smoke tests using lightweight auth/storage stubs. These do not
// reproduce Supabase's Storage API, JWT validation or concurrent connections.
test('migrations enforce profile, content and rolling write permissions in PostgreSQL', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create schema storage;
      create table auth.users (id uuid primary key, email text);
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $$;
      grant usage on schema auth, storage to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
      alter table storage.objects enable row level security;
      grant select, insert, delete on storage.objects to anon, authenticated;
      create function storage.foldername(name text) returns text[] language sql immutable as $$
        select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1)-1]
      $$;
    `);
    for (const file of [
      '20261125000000_profiles.sql', '20261125010000_content_and_social.sql',
      '20261125020000_restrict_client_columns.sql', '20261125030000_write_limits.sql',
    ]) await db.exec(await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8'));

    const a = '20000000-0000-0000-0000-000000000001';
    const b = '20000000-0000-0000-0000-000000000002';
    const video = '30000000-0000-0000-0000-000000000001';
    await db.exec(`insert into auth.users(id,email) values ('${a}','one@example.test'),('${b}','two@example.test');
      insert into public.videos(id,creator_id,caption,source_type,playback_url,status)
      values ('${video}','${a}','approved','external_direct','https://example.com/video.mp4','approved');`);
    assert.equal((await db.query('select count(*)::int as n from public.profiles')).rows[0].n, 2);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${a}', false);`);
    assert.equal((await db.query(`update public.profiles set bio = 'not yours' where id = '${b}' returning id`)).rows.length, 0);
    await assert.rejects(db.query(`update public.videos set status = 'approved' where id = '${video}'`), e => e.code === '42501');
    await assert.rejects(db.query(`select * from sleer_private.write_events`), e => e.code === '42501');
    for (let i = 0; i < 10; i++) await db.query(`insert into public.reports(user_id,video_id,reason) values ('${a}','${video}','reason')`);
    await assert.rejects(db.query(`insert into public.reports(user_id,video_id,reason) values ('${a}','${video}','reason')`), e => e.message.includes('SLEER_RATE_LIMIT'));
    // A different user has a separate budget.
    await db.exec(`select set_config('request.jwt.claim.sub', '${b}', false)`);
    await db.query(`insert into public.reports(user_id,video_id,reason) values ('${b}','${video}','reason')`);
    // RLS still prevents writing another user's identity.
    await assert.rejects(db.query(`insert into public.reports(user_id,video_id,reason) values ('${a}','${video}','impersonation')`), e => e.code === '42501');
    // Successful uploads consume the limit even when later deleted.
    for (let i = 0; i < 10; i++) {
      const uploadPath = `${b}/40000000-0000-0000-0000-${String(i).padStart(12, '0')}.mp4`;
      await db.query(`insert into storage.objects(bucket_id,name) values ('creator-videos','${uploadPath}')`);
      await db.query(`delete from storage.objects where bucket_id = 'creator-videos' and name = '${uploadPath}'`);
    }
    await assert.rejects(db.query(`insert into storage.objects(bucket_id,name) values ('creator-videos','${b}/40000000-0000-0000-0000-000000000010.mp4')`), e => e.message.includes('SLEER_RATE_LIMIT'));
    await db.exec('reset role');
    await db.query(`update sleer_private.write_events set occurred_at = clock_timestamp() - interval '25 hours' where user_id = '${b}' and action = 'video_upload'`);
    await db.exec('set role authenticated');
    // A pending upload can only be accessed by its owner, including in storage.
    const path = `${b}/30000000-0000-0000-0000-000000000003.mp4`;
    await db.query(`insert into storage.objects(bucket_id,name) values ('creator-videos','${path}')`);
    await db.query(`insert into public.videos(creator_id,creator_name,caption,category,creator_asserted_rights,source_type,storage_path) values ('${b}','Creator','pending','General',true,'uploaded','${path}')`);
    await db.exec(`select set_config('request.jwt.claim.sub', '${a}', false)`);
    assert.equal((await db.query(`select name from storage.objects where name = '${path}'`)).rows.length, 0);
    await db.exec('reset role');
    await db.query(`update public.videos set status = 'approved' where storage_path = '${path}'`);
    await db.exec('set role anon');
    assert.equal((await db.query(`select name from storage.objects where name = '${path}'`)).rows.length, 1);
  } finally { await db.close(); }
});
