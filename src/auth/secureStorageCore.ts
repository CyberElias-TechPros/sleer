/** Small key-value abstraction to make the native session adapter testable. */
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

type Manifest = { version: 1; generation: string; chunks: number };
const CHUNK_CODEPOINTS = 300; // At most 1,200 UTF-8 bytes, below native per-item limits.
const MAX_CHUNKS = 512;
const namespace = (key: string) => `sleer_${Array.from(key, c => c.codePointAt(0)!.toString(16) + '_').join('')}`;

function parseManifest(raw: string): Manifest {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('Invalid secure session manifest');
  const m = value as Partial<Manifest>;
  if (m.version !== 1 || typeof m.generation !== 'string' || !/^[a-zA-Z0-9-]+$/.test(m.generation) || !Number.isInteger(m.chunks) || m.chunks! < 1 || m.chunks! > MAX_CHUNKS) throw new Error('Invalid secure session manifest');
  return m as Manifest;
}

/** Store chunks first and switch a small manifest last. Calls are serialized so
 * readers cannot race cleanup. Legacy plaintext is removed only after commit. */
export function createSecureSessionStorage(secure: KeyValueStore, legacy: KeyValueStore, newId: () => string): KeyValueStore {
  let tail: Promise<void> = Promise.resolve();
  const locked = <T>(work: () => Promise<T>): Promise<T> => {
    const result = tail.then(work, work);
    tail = result.then(() => undefined, () => undefined);
    return result;
  };
  const base = (key: string) => namespace(key);
  const manifestKey = (key: string) => `${base(key)}manifest`;
  const chunkKey = (key: string, m: Manifest, index: number) => `${base(key)}${m.generation}_${index}`;
  const cleanup = async (key: string, m: Manifest) => {
    for (let i = 0; i < m.chunks; i++) await secure.removeItem(chunkKey(key, m, i)).catch(() => {});
  };
  const write = async (key: string, value: string) => {
    const oldRaw = await secure.getItem(manifestKey(key));
    const old = oldRaw ? parseManifest(oldRaw) : null;
    const codepoints = Array.from(value);
    const chunks: string[] = [];
    for (let i = 0; i < codepoints.length; i += CHUNK_CODEPOINTS) chunks.push(codepoints.slice(i, i + CHUNK_CODEPOINTS).join(''));
    if (!chunks.length) chunks.push('');
    if (chunks.length > MAX_CHUNKS) throw new Error('Session is too large for secure storage');
    const next: Manifest = { version: 1, generation: newId(), chunks: chunks.length };
    if (!/^[a-zA-Z0-9-]+$/.test(next.generation)) throw new Error('Invalid secure session generation');
    try {
      for (let i = 0; i < chunks.length; i++) await secure.setItem(chunkKey(key, next, i), chunks[i]);
      await secure.setItem(manifestKey(key), JSON.stringify(next));
    } catch (error) { await cleanup(key, next); throw error; }
    // Failure to clear legacy storage should be surfaced, not silently ignored.
    await legacy.removeItem(key);
    if (old) await cleanup(key, old);
  };
  return {
    getItem: key => locked(async () => {
      const raw = await secure.getItem(manifestKey(key));
      if (!raw) {
        const value = await legacy.getItem(key);
        if (value !== null) await write(key, value);
        return value;
      }
      const manifest = parseManifest(raw);
      let value = '';
      for (let i = 0; i < manifest.chunks; i++) {
        const part = await secure.getItem(chunkKey(key, manifest, i));
        if (part === null) throw new Error('Secure session is incomplete');
        value += part;
      }
      // Also clean a legacy value if the app was interrupted after commit.
      await legacy.removeItem(key);
      return value;
    }),
    setItem: (key, value) => locked(() => write(key, value)),
    removeItem: key => locked(async () => {
      const raw = await secure.getItem(manifestKey(key));
      const manifest = raw ? parseManifest(raw) : null;
      // Delete legacy first so it cannot resurrect a signed-out session.
      await legacy.removeItem(key);
      await secure.removeItem(manifestKey(key));
      if (manifest) await cleanup(key, manifest);
    }),
  };
}
