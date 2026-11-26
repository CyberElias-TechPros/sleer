import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './auth/client';
import { categories } from './categories';
import { shouldRemoveFailedUpload } from './uploadSafety';

const MAX_BYTES = 15 * 1024 * 1024;
export function UploadScreen({ session }: { session: Session | null }) {
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('General');
  const [rights, setRights] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function choose() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 1 });
      if (!result.canceled) { setAsset(result.assets[0]); setMessage(''); }
    } catch { setMessage('Could not open your video library.'); }
  }
  async function submit() {
    if (!supabase || !session || busy) return;
    if (!asset || asset.mimeType !== 'video/mp4' || !asset.fileSize || asset.fileSize > MAX_BYTES) { setMessage('Choose an MP4 video with a known size of at most 15 MB.'); return; }
    if (!caption.trim() || !category.trim() || !rights) { setMessage('Add a caption and category, and confirm you have permission.'); return; }
    setBusy(true); setMessage('');
    const path = `${session.user.id}/${Crypto.randomUUID()}.mp4`;
    let uploaded = false;
    let metadataAttempted = false;
    try {
      const file = new File(asset.uri);
      if (!file.exists || file.size <= 0 || file.size > MAX_BYTES) throw new Error('The file must be no larger than 15 MB.');
      const bytes = await file.arrayBuffer();
      if (bytes.byteLength > MAX_BYTES || bytes.byteLength === 0) throw new Error('The file must be no larger than 15 MB.');
      const { error: uploadError } = await supabase.storage.from('creator-videos').upload(path, bytes, { contentType: 'video/mp4', upsert: false });
      if (uploadError) throw uploadError;
      uploaded = true;
      const { data: profile, error: profileError } = await supabase.from('profiles').select('display_name').eq('id', session.user.id).single();
      if (profileError || !profile) throw profileError ?? new Error('Profile unavailable');
      metadataAttempted = true;
      const { error } = await supabase.from('videos').insert({ creator_id: session.user.id, creator_name: profile.display_name, caption: caption.trim(), category: category.trim(), attribution: '', creator_asserted_rights: true, source_type: 'uploaded', storage_path: path });
      if (error) throw error;
      setAsset(null); setCaption(''); setRights(false); setMessage('Submitted for review. It will appear in the feed only after approval.');
    } catch {
      // A timed-out insert may have committed. Never delete a file that could now
      // be referenced by a submission; leave ambiguous cases for reconciliation.
      if (shouldRemoveFailedUpload(uploaded, metadataAttempted)) await supabase.storage.from('creator-videos').remove([path]).catch(() => {});
      setMessage(metadataAttempted ? 'Submission status is unknown. Ask an administrator to check before retrying; your upload may have been received.' : 'Upload failed. Check your connection and try again. An administrator may need to clean up an incomplete upload.');
    } finally { setBusy(false); }
  }
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.kicker}>SHARE YOUR STORY</Text><Text style={styles.title}>Create a video</Text>
    {!supabase ? <Text style={styles.info}>Connect Supabase to enable creator submissions.</Text> : !session ? <Text style={styles.info}>Sign in from Profile before submitting a video.</Text> : <>
      <Text style={styles.info}>Submit an MP4 up to 15 MB. Your video stays private until an administrator approves it.</Text>
      <Pressable style={styles.picker} onPress={choose} disabled={busy}><Text style={styles.pickerText}>{asset ? `Selected: ${asset.fileName || 'video'}` : '+  Choose a video'}</Text></Pressable>
      <Text style={styles.label}>CAPTION</Text><TextInput accessibilityLabel="Caption" style={styles.input} value={caption} onChangeText={setCaption} maxLength={220} placeholder="Tell us about your video" placeholderTextColor="#89827d" />
      <Text style={styles.label}>CATEGORY</Text><View style={styles.categories}>{categories.filter(c => c !== 'All').map(c => <Pressable key={c} accessibilityRole="button" accessibilityState={{ selected: category === c }} disabled={busy} onPress={() => setCategory(c)} style={[styles.chip, category === c && styles.activeChip]}><Text style={[styles.chipText, category === c && styles.activeChipText]}>{c}</Text></Pressable>)}</View>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: rights }} onPress={() => setRights(!rights)} style={styles.check}><View style={[styles.box, rights && styles.checked]} /><Text style={styles.checkText}>I own this video or have permission to share it.</Text></Pressable>
      <Pressable accessibilityRole="button" style={[styles.button, busy && { opacity: 0.6 }]} onPress={submit} disabled={busy}>{busy ? <ActivityIndicator color="#211813" /> : <Text style={styles.buttonText}>Submit for review</Text>}</Pressable>
    </>}
    {!!message && <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>}
  </ScrollView>;
}
const styles = StyleSheet.create({categories:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{backgroundColor:'#302b28',borderRadius:20,paddingHorizontal:13,paddingVertical:9},activeChip:{backgroundColor:'#ff874a'},chipText:{color:'#e4dcd6'},activeChipText:{color:'#211813',fontWeight:'700'},screen:{flex:1,backgroundColor:'#171816'},content:{padding:24,paddingTop:48,paddingBottom:40},kicker:{color:'#ff874a',fontSize:11,fontWeight:'800',letterSpacing:2},title:{color:'white',fontSize:30,fontWeight:'800',marginTop:7},info:{color:'#c9c1bc',fontSize:15,lineHeight:23,marginTop:12},picker:{borderColor:'#7b6050',borderWidth:1,borderStyle:'dashed',backgroundColor:'#292420',borderRadius:14,padding:26,marginTop:24,alignItems:'center'},pickerText:{color:'#ffb185',fontWeight:'700'},label:{color:'#d7cfc9',fontSize:11,fontWeight:'700',letterSpacing:1,marginTop:20,marginBottom:8},input:{color:'white',backgroundColor:'#292724',borderWidth:1,borderColor:'#47413d',borderRadius:12,padding:14,fontSize:16},check:{flexDirection:'row',alignItems:'center',gap:10,marginTop:22},box:{width:22,height:22,borderColor:'#bca99d',borderWidth:1,borderRadius:5},checked:{backgroundColor:'#ff874a'},checkText:{color:'#ddd',flex:1,lineHeight:20},button:{backgroundColor:'#ff874a',borderRadius:14,padding:16,alignItems:'center',marginTop:24},buttonText:{color:'#211813',fontWeight:'800',fontSize:16},message:{color:'#eee0d6',marginTop:20,lineHeight:22}});
