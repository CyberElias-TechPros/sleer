import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './client';
import { validateCredentials, validateProfile } from './validation';

const orange = '#ff874a';
type Props = { session: Session | null; loading: boolean; configured: boolean; onSaved: () => void };
type Profile = { display_name: string; bio: string };

export function ProfileScreen({ session, loading, configured, onSaved }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const userId = session?.user.id;

  useEffect(() => {
    let cancelled = false;
    setProfile(null);
    setName(''); setBio(''); setMessage('');
    if (!userId || !supabase) { setProfileLoading(false); return; }
    setProfileLoading(true);
    Promise.resolve(supabase.from('profiles').select('display_name,bio').eq('id', userId).single()).then(({ data, error }) => {
      if (cancelled) return;
      setProfileLoading(false);
      if (error || !data) { setMessage('Could not load your profile. Check your connection and database setup.'); return; }
      setProfile(data); setName(data.display_name); setBio(data.bio);
    }).catch(() => {
      if (!cancelled) { setProfileLoading(false); setMessage('Could not load your profile. Check your connection and database setup.'); }
    });
    return () => { cancelled = true; };
  }, [userId, reload]);

  async function authenticate() {
    if (!supabase || busy) return;
    const issue = validateCredentials(email, password);
    if (issue) { setMessage(issue); return; }
    setBusy(true); setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) setMessage(error.message);
        else if (!data.session) { setPassword(''); setMessage('If sign-up succeeded, check your email for a confirmation link, then sign in.'); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) setMessage(error.message);
        else setPassword('');
      }
    } catch { setMessage('Unable to connect. Please try again.'); }
    finally { setBusy(false); }
  }
  async function save() {
    if (!supabase || !userId || busy) return;
    const issue = validateProfile(name, bio);
    if (issue) { setMessage(issue); return; }
    setBusy(true); setMessage('');
    try {
      const { data, error } = await supabase.from('profiles').update({ display_name: name.trim(), bio }).eq('id', userId).select('display_name,bio').single();
      if (error || !data) setMessage('Could not save your profile. Please try again.');
      else { setProfile(data); setName(data.display_name); setBio(data.bio); setMessage('Profile saved.'); }
    } catch { setMessage('Unable to connect. Please try again.'); }
    finally { setBusy(false); }
  }
  async function signOut() {
    if (!supabase || busy) return;
    setBusy(true); setMessage('');
    try { const { error } = await supabase.auth.signOut(); if (error) setMessage(error.message); }
    catch { setMessage('Unable to sign out. Please try again.'); }
    finally { setBusy(false); }
  }
  return <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>YOUR SPACE</Text><Text style={styles.title}>Profile</Text>
      {!configured ? <Text style={styles.note}>Accounts aren't configured yet. Add your Supabase project URL and public key to .env, then restart Expo. The demo feed is still available.</Text>
      : loading ? <ActivityIndicator color={orange} />
      : !session ? <>
        <Text style={styles.subtitle}>{mode === 'signin' ? 'Welcome back to Sleer.' : 'Join the Sleer community.'}</Text>
        <Text style={styles.label}>EMAIL</Text><TextInput accessibilityLabel="Email" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#918b87" style={styles.input} />
        <Text style={styles.label}>PASSWORD</Text><TextInput accessibilityLabel="Password" secureTextEntry autoCapitalize="none" value={password} onChangeText={setPassword} placeholder="Your password" placeholderTextColor="#918b87" style={styles.input} />
        <Pressable accessibilityRole="button" disabled={busy} onPress={authenticate} style={[styles.button, busy && styles.disabled]}><Text style={styles.buttonText}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(''); }}><Text style={styles.link}>{mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}</Text></Pressable>
      </> : <>
        <View style={styles.avatar}><Text style={styles.avatarText}>{(name.trim()[0] || 'S').toUpperCase()}</Text></View>
        <Text style={styles.subtitle}>{session.user.email}</Text>
        {profileLoading ? <ActivityIndicator color={orange} /> : profile ? <>
          <Text style={styles.label}>DISPLAY NAME</Text><TextInput accessibilityLabel="Display name" value={name} maxLength={40} onChangeText={setName} placeholderTextColor="#918b87" style={styles.input} />
          <Text style={styles.label}>BIO</Text><TextInput accessibilityLabel="Bio" value={bio} maxLength={160} onChangeText={setBio} multiline placeholder="Tell us a little about yourself" placeholderTextColor="#918b87" style={[styles.input, styles.bio]} />
          <Pressable accessibilityRole="button" disabled={busy} onPress={save} style={[styles.button, busy && styles.disabled]}><Text style={styles.buttonText}>{busy ? 'Please wait…' : 'Save profile'}</Text></Pressable>
        </> : <Pressable accessibilityRole="button" onPress={() => setReload(n => n + 1)}><Text style={styles.link}>Retry loading profile</Text></Pressable>}
        <Pressable accessibilityRole="button" onPress={onSaved}><Text style={styles.link}>View saved videos</Text></Pressable>
        <Pressable accessibilityRole="button" disabled={busy} onPress={signOut}><Text style={styles.link}>Sign out</Text></Pressable>
      </>}
      {!!message && <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>}
    </ScrollView>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
 container:{flex:1,backgroundColor:'#171816'},content:{paddingHorizontal:24,paddingTop:48,paddingBottom:35},kicker:{color:orange,fontSize:11,fontWeight:'800',letterSpacing:2},title:{fontSize:32,color:'#fff',fontWeight:'800',marginTop:5},subtitle:{color:'#c9c1bc',fontSize:15,marginTop:8,marginBottom:26},note:{color:'#d1cac5',fontSize:16,lineHeight:24,marginTop:20},label:{color:'#d7cfc9',fontSize:11,fontWeight:'700',letterSpacing:1,marginTop:15,marginBottom:8},input:{color:'white',backgroundColor:'#292724',borderColor:'#47413d',borderWidth:1,borderRadius:12,paddingHorizontal:15,paddingVertical:13,fontSize:16},bio:{height:100,textAlignVertical:'top'},button:{backgroundColor:orange,borderRadius:14,alignItems:'center',padding:16,marginTop:25},disabled:{opacity:0.6},buttonText:{color:'#231713',fontSize:16,fontWeight:'800'},link:{color:orange,textAlign:'center',fontWeight:'700',marginTop:22},message:{color:'#eee0d6',lineHeight:21,marginTop:20,textAlign:'center'},avatar:{marginTop:20,width:64,height:64,backgroundColor:'#956347',borderRadius:32,alignItems:'center',justifyContent:'center'},avatarText:{fontSize:26,color:'white',fontWeight:'800'}
});
