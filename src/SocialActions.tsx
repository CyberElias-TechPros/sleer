import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './auth/client';
import { Video } from './feed';

type Comment = { id: string; user_id: string; body: string; profiles: { display_name: string } | null };
type Icon = React.ComponentProps<typeof Ionicons>['name'];
function Button({ icon, label, selected, onPress }: { icon: Icon; label: string; selected?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.action}><View style={styles.circle}><Ionicons name={icon} size={26} color={selected ? '#ff874a' : 'white'} /></View><Text style={styles.actionText}>{label}</Text></Pressable>;
}
export function SocialActions({ video, session, demo, onShare }: { video: Video; session: Session | null; demo: boolean; onShare: () => void }) {
  const [liked, setLiked] = useState(false); const [saved, setSaved] = useState(false); const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false); const [modal, setModal] = useState<'comments' | 'report' | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); const [text, setText] = useState(''); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false);
  const userId = session?.user.id;
  const [interactionState, setInteractionState] = useState<'loading' | 'ready' | 'error'>(demo || !userId ? 'ready' : 'loading');
  const [reloadInteractions, setReloadInteractions] = useState(0);
  const generation = useRef(0);
  useEffect(() => {
    let cancelled = false;
    generation.current += 1;
    setBusy(false); setLiked(false); setSaved(false); setFollowing(false);
    if (!supabase || !userId || demo) { setInteractionState('ready'); return; }
    setInteractionState('loading');
    const client = supabase;
    Promise.all([
      client.from('likes').select('video_id').eq('user_id', userId).eq('video_id', video.id).maybeSingle(),
      client.from('bookmarks').select('video_id').eq('user_id', userId).eq('video_id', video.id).maybeSingle(),
      video.creatorId ? client.from('follows').select('creator_id').eq('user_id', userId).eq('creator_id', video.creatorId).maybeSingle() : Promise.resolve({ data: null, error: null }),
    ]).then(([like, save, follow]) => {
      if (cancelled) return;
      if (like.error || save.error || follow.error) { setInteractionState('error'); return; }
      setLiked(!!like.data); setSaved(!!save.data); setFollowing(!!follow.data); setInteractionState('ready');
    }).catch(() => { if (!cancelled) setInteractionState('error'); });
    return () => { cancelled = true; };
  }, [userId, video.id, video.creatorId, demo, reloadInteractions]);
  async function toggle(kind: 'likes' | 'bookmarks' | 'follows') {
    if (demo) { if (kind === 'likes') setLiked(!liked); else if (kind === 'bookmarks') setSaved(!saved); else Alert.alert('Follow', 'Connect Supabase and sign in to follow creators.'); return; }
    if (!supabase || !userId) { Alert.alert('Sign in', 'Sign in from Profile to use this feature.'); return; }
    if (busy || interactionState === 'loading') return;
    if (interactionState === 'error') { Alert.alert('Could not load your actions', 'Check your connection and retry.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: () => setReloadInteractions(n => n + 1) }]); return; }
    if (kind === 'follows' && (!video.creatorId || video.creatorId === userId)) { Alert.alert('Follow', 'This creator cannot be followed.'); return; }
    const current = kind === 'likes' ? liked : kind === 'bookmarks' ? saved : following;
    const key = kind === 'follows' ? 'creator_id' : 'video_id';
    const target = kind === 'follows' ? video.creatorId! : video.id;
    setBusy(true);
    const requestGeneration = generation.current;
    try {
      const { error } = current
        ? await supabase.from(kind).delete().eq('user_id', userId).eq(key, target)
        : await supabase.from(kind).insert({ user_id: userId, [key]: target });
      if (error) throw error;
      if (requestGeneration !== generation.current) return;
      if (kind === 'likes') setLiked(!current); else if (kind === 'bookmarks') setSaved(!current); else setFollowing(!current);
    } catch { if (requestGeneration === generation.current) { setInteractionState('error'); Alert.alert('Could not update', 'The result may be uncertain. Tap the action to reload its current state.'); } } finally { if (requestGeneration === generation.current) setBusy(false); }
  }
  async function fetchComments() {
    if (!supabase || demo) return;
    setLoading(true); setMessage('');
    try {
      const { data, error } = await supabase.from('comments').select('id,user_id,body,profiles(display_name)').eq('video_id', video.id).order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      setComments((data ?? []) as unknown as Comment[]);
    } catch { setMessage('Could not load comments.'); } finally { setLoading(false); }
  }
  async function submit() {
    if (!supabase || !userId || demo) { setMessage('Sign in and connect Supabase to continue.'); return; }
    if (!text.trim() || busy) return;
    setBusy(true); setMessage('');
    try {
      const result = modal === 'comments'
        ? await supabase.from('comments').insert({ user_id: userId, video_id: video.id, body: text.trim() })
        : await supabase.from('reports').insert({ user_id: userId, video_id: video.id, reason: text.trim() });
      if (result.error) throw result.error;
      setText('');
      if (modal === 'comments') await fetchComments(); else { setModal(null); Alert.alert('Report submitted', 'Thank you. An administrator can review it.'); }
    } catch { setMessage('Could not submit. Please try again.'); } finally { setBusy(false); }
  }
  async function deleteComment(id: string) {
    if (!supabase || !userId || busy) return;
    setBusy(true);
    try { const { error } = await supabase.from('comments').delete().eq('id', id).eq('user_id', userId); if (error) throw error; await fetchComments(); }
    catch { setMessage('Could not delete comment.'); } finally { setBusy(false); }
  }
  return <View style={styles.actions}>
    <Pressable accessibilityRole="button" accessibilityLabel={following ? 'Unfollow creator' : 'Follow creator'} onPress={() => toggle('follows')} style={styles.avatar}><Text style={styles.avatarText}>{following ? '✓' : (video.creator[0] || 'S').toUpperCase()}</Text></Pressable>
    <Button icon={liked ? 'heart' : 'heart-outline'} label={liked ? 'Liked' : 'Like'} selected={liked} onPress={() => toggle('likes')} />
    <Button icon="chatbubble-ellipses-outline" label="Comment" onPress={() => { setModal('comments'); setText(''); setMessage(demo ? 'Comments are available after connecting Supabase.' : ''); if (!demo) fetchComments(); }} />
    <Button icon={saved ? 'bookmark' : 'bookmark-outline'} label={saved ? 'Saved' : 'Save'} selected={saved} onPress={() => toggle('bookmarks')} />
    <Button icon="arrow-redo-outline" label="Share" onPress={onShare} />
    <Button icon="flag-outline" label="Report" onPress={() => { setModal('report'); setText(''); setMessage(''); }} />
    <Modal visible={modal !== null} animationType="slide" transparent onRequestClose={() => setModal(null)}>
      <View style={styles.overlay}><View style={styles.sheet}><View style={styles.sheetHeader}><Text style={styles.title}>{modal === 'comments' ? 'Comments' : 'Report video'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setModal(null)}><Ionicons name="close" size={26} color="white" /></Pressable></View>
      {modal === 'comments' ? <ScrollView style={styles.list}>{loading ? <ActivityIndicator color="#ff874a" /> : comments.length ? comments.map(c => <View key={c.id} style={styles.comment}><View style={{ flex: 1 }}><Text style={styles.author}>{c.profiles?.display_name || 'Sleer user'}</Text><Text style={styles.body}>{c.body}</Text></View>{userId === c.user_id && <Pressable onPress={() => deleteComment(c.id)} accessibilityRole="button" accessibilityLabel="Delete comment"><Text style={styles.remove}>Delete</Text></Pressable>}</View>) : <Text style={styles.body}>No comments yet.</Text>}</ScrollView> : <Text style={styles.body}>Tell us why this video needs review. Reports are private to administrators.</Text>}
      <TextInput accessibilityLabel={modal === 'comments' ? 'Comment' : 'Report reason'} style={styles.input} placeholder={modal === 'comments' ? 'Add a comment' : 'Reason for report'} placeholderTextColor="#999" multiline maxLength={500} value={text} onChangeText={setText} />
      {!!message && <Text style={styles.message}>{message}</Text>}
      <Pressable accessibilityRole="button" disabled={busy} onPress={submit} style={styles.submit}><Text style={styles.submitText}>{busy ? 'Sending…' : modal === 'comments' ? 'Post comment' : 'Send report'}</Text></Pressable>
      </View></View>
    </Modal>
  </View>;
}
const styles = StyleSheet.create({ actions:{position:'absolute',right:14,bottom:25,alignItems:'center',gap:7},avatar:{width:43,height:43,borderRadius:22,backgroundColor:'#917053',borderWidth:2,borderColor:'white',alignItems:'center',justifyContent:'center'},avatarText:{color:'white',fontWeight:'bold',fontSize:20},action:{alignItems:'center',gap:2},circle:{width:41,height:41,borderRadius:21,backgroundColor:'#18181899',alignItems:'center',justifyContent:'center'},actionText:{fontSize:10,color:'white'},overlay:{flex:1,justifyContent:'flex-end',backgroundColor:'#0009'},sheet:{maxHeight:'80%',minHeight:'48%',backgroundColor:'#24211f',padding:20,borderTopLeftRadius:22,borderTopRightRadius:22},sheetHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20},title:{color:'white',fontSize:21,fontWeight:'800'},list:{maxHeight:300,marginBottom:10},comment:{flexDirection:'row',gap:10,marginBottom:15},author:{color:'#ffaf7c',fontWeight:'700',marginBottom:4},body:{color:'#e5ded9',lineHeight:20},remove:{color:'#ffad87'},input:{color:'white',backgroundColor:'#393431',borderRadius:10,padding:12,marginTop:15,maxHeight:110},message:{color:'#efc2a9',marginTop:8},submit:{backgroundColor:'#ff874a',borderRadius:12,padding:14,alignItems:'center',marginTop:12},submitText:{color:'#211813',fontWeight:'800'}});
