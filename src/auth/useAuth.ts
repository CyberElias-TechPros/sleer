import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './client';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!!supabase);
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    // INITIAL_SESSION is emitted after the persisted session has been loaded.
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    const refresh = (state: string) => {
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    };
    refresh(AppState.currentState ?? 'background');
    const appState = AppState.addEventListener('change', refresh);
    return () => { appState.remove(); subscription.unsubscribe(); client.auth.stopAutoRefresh(); };
  }, []);
  return { session, loading, configured: !!supabase };
}
