import 'react-native-url-polyfill/auto';
import { sessionStorage } from './storage';
import { createClient } from '@supabase/supabase-js';

// EXPO_PUBLIC values are included in the app bundle. These must be public keys only.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function makeClient() {
  if (!url || !key) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !parsed.hostname) return null;
    return createClient(url, key, {
      auth: { storage: sessionStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    });
  } catch {
    return null;
  }
}
export const supabase = makeClient();
