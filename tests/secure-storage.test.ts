import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createSecureSessionStorage, type KeyValueStore } from '../src/auth/secureStorageCore.ts';

function memory() {
  const data = new Map<string, string>();
  const store: KeyValueStore = {
    async getItem(key) { return data.get(key) ?? null; },
    async setItem(key, value) { data.set(key, value); },
    async removeItem(key) { data.delete(key); },
  };
  return { data, store };
}
test('migrates legacy tokens and persists long unicode sessions in bounded chunks', async () => {
  const secure = memory(); const legacy = memory(); let id = 0;
  const storage = createSecureSessionStorage(secure.store, legacy.store, () => String(++id));
  const original = '🙂héllo'.repeat(600);
  await legacy.store.setItem('session', original);
  assert.equal(await storage.getItem('session'), original);
  assert.equal(await legacy.store.getItem('session'), null);
  for (const [key, value] of secure.data) if (!key.endsWith('manifest')) assert.ok(Buffer.byteLength(value, 'utf8') <= 1200);
  const updated = 'new session';
  await storage.setItem('session', updated);
  assert.equal(await storage.getItem('session'), updated);
  await storage.removeItem('session');
  assert.equal(await storage.getItem('session'), null);
  assert.equal(secure.data.size, 0);
});
test('failed manifest write retains previous committed session', async () => {
  const secure = memory(); const legacy = memory(); let id = 0; let fail = false;
  const backend = { ...secure.store, async setItem(key: string, value: string) { if (fail && key.endsWith('manifest')) throw new Error('unavailable'); await secure.store.setItem(key, value); } };
  const storage = createSecureSessionStorage(backend, legacy.store, () => String(++id));
  await storage.setItem('session', 'old');
  fail = true;
  await assert.rejects(storage.setItem('session', 'new'), /unavailable/);
  assert.equal(await storage.getItem('session'), 'old');
});
test('serializes reads and writes and refuses missing chunks', async () => {
  const secure = memory(); const legacy = memory(); let id = 0;
  const storage = createSecureSessionStorage(secure.store, legacy.store, () => String(++id));
  const write = storage.setItem('session', 'first');
  const read = storage.getItem('session');
  await write; assert.equal(await read, 'first');
  const key = [...secure.data.keys()].find(k => !k.endsWith('manifest'))!;
  secure.data.delete(key);
  await assert.rejects(storage.getItem('session'), /incomplete/);
});
