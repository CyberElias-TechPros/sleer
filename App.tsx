import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState, FlatList, LayoutChangeEvent, Platform, Pressable, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { activeIdFromViewable, shouldPlay, Video, videos } from './src/feed';
import { useAuth } from './src/auth/useAuth';
import { ProfileScreen } from './src/auth/ProfileScreen';
import { UploadScreen } from './src/UploadScreen';
import { DiscoverScreen } from './src/DiscoverScreen';
import { SocialActions } from './src/SocialActions';
import { loadFeed, PAGE_SIZE, resolveVideoUrl } from './src/content';
import { supabase } from './src/auth/client';
import { searchPattern } from './src/search';
import type { Session } from '@supabase/supabase-js';

const orange = '#ff874a';
type Icon = React.ComponentProps<typeof Ionicons>['name'];

function VideoPlayback({ url, appActive, onRetry }: { url: string; appActive: boolean; onRetry: () => void }) {
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const player = useVideoPlayer(url, p => { p.loop = true; p.muted = true; });
  const { status, error } = useEvent(player, 'statusChange', { status: player.status, error: undefined });
  useEffect(() => { if (shouldPlay(true, appActive, paused)) player.play(); else player.pause(); }, [player, appActive, paused]);
  useEffect(() => { player.muted = muted; }, [player, muted]);
  return <View style={StyleSheet.absoluteFill}>
    <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
    {status === 'loading' || status === 'idle' ? <View style={styles.center}><ActivityIndicator color={orange} /><Text style={styles.status}>Loading video…</Text></View> : null}
    {status === 'error' ? <View style={styles.center}><Ionicons name="cloud-offline-outline" color="white" size={36} /><Text style={styles.status}>Video unavailable. Check your connection.</Text><Text style={styles.smallStatus}>{error?.message ? 'Please try again later.' : ''}</Text></View> : null}
    <Pressable style={styles.videoTouch} accessibilityRole="button" accessibilityLabel={paused ? 'Play video' : 'Pause video'} onPress={() => setPaused(!paused)}>{paused && <Ionicons name="play-circle" color="white" size={64} />}</Pressable>
    {status === 'error' && <Pressable accessibilityRole="button" accessibilityLabel="Retry video" onPress={onRetry} style={styles.retryVideo}><Text style={styles.retry}>Retry video</Text></Pressable>}
    <Pressable style={styles.mute} accessibilityRole="button" accessibilityLabel={muted ? 'Unmute video' : 'Mute video'} onPress={() => setMuted(!muted)}><Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={20} color="white" /></Pressable>
  </View>;
}

function Player({ video, appActive }: { video: Video; appActive: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setUrl(null); setFailed(false);
    resolveVideoUrl(video).then(value => { if (!cancelled) { if (value) setUrl(value); else setFailed(true); } }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [video, attempt]);
  if (failed) return <View style={styles.center}><Text style={styles.status}>Video unavailable. Check your connection.</Text><Pressable accessibilityRole="button" onPress={() => setAttempt(n => n + 1)}><Text style={styles.retry}>Retry video</Text></Pressable></View>;
  if (!url) return <View style={styles.center}><ActivityIndicator color={orange} /><Text style={styles.status}>Loading video…</Text></View>;
  return <VideoPlayback key={attempt} url={url} appActive={appActive} onRetry={() => setAttempt(n => n + 1)} />;
}

function Card({ item, height, active, appActive, session, demo }: { item: Video; height: number; active: boolean; appActive: boolean; session: Session | null; demo: boolean }) {
  return <View style={{ height, backgroundColor: '#171c1b' }}>
    {active && <Player video={item} appActive={appActive} />}
    <LinearGradient pointerEvents="none" colors={['rgba(0,0,0,0.52)', 'transparent', 'rgba(0,0,0,0.84)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
    <SocialActions video={item} session={session} demo={demo} onShare={() => {
      if (!item.url) { Alert.alert('Share', 'Sharing uploaded videos through app links is not available yet.'); return; }
      Share.share({ message: `${item.caption}\n${item.url}` }).catch(() => Alert.alert('Unable to share'));
    }} />
    <View style={styles.details} pointerEvents="none">
      <Text style={styles.creator}>@{item.creator}</Text><Text style={styles.caption}>{item.caption}</Text>
      <View style={styles.tag}><Text style={styles.tagText}><Text style={{ color: orange }}># </Text>{item.category}</Text></View>
      <Text style={styles.attribution}>{item.attribution}</Text>
      {demo && <Text style={styles.attribution}>Demo • likes and saves are temporary</Text>}
    </View>
  </View>;
}

export default function App() {
  const [height, setHeight] = useState(0);
  const [screen, setScreen] = useState<'Home' | 'Profile' | 'Discover' | 'Create'>('Home');
  const [feedVideos, setFeedVideos] = useState<Video[]>(supabase ? [] : videos);
  const [feedLoading, setFeedLoading] = useState(!!supabase);
  const [feedError, setFeedError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState({ category: 'All', search: '' });
  const [followingFeed, setFollowingFeed] = useState(false);
  const [savedFeed, setSavedFeed] = useState(false);
  const feedGeneration = useRef(0);
  const feedOffset = useRef(0);
  const [reloadFeed, setReloadFeed] = useState(0);
  const loadingMore = useRef(false);
  const auth = useAuth();
  const [activeId, setActiveId] = useState<string | null>(videos[0]?.id ?? null);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  useEffect(() => { const sub = AppState.addEventListener('change', state => setAppActive(state === 'active')); return () => sub.remove(); }, []);
  useEffect(() => {
    let cancelled = false;
    feedGeneration.current += 1;
    feedOffset.current = 0;
    if (!supabase) {
      const raw = filter.search.trim();
      const pattern = searchPattern(raw);
      const text = pattern?.slice(1, -1).toLowerCase();
      const list = raw && !pattern ? [] : videos.filter(v => (filter.category === 'All' || v.category === filter.category) && (!text || v.caption.toLowerCase().includes(text)));
      setFeedVideos(list); setActiveId(list[0]?.id ?? null); return;
    }
    if ((followingFeed || savedFeed) && !auth.session) { setFeedVideos([]); setActiveId(null); setHasMore(false); setFeedLoading(false); return; }
    setFeedLoading(true); setFeedError(''); setFeedVideos([]); setHasMore(false);
    loadFeed(0, filter.category, filter.search, followingFeed ? auth.session?.user.id : undefined, savedFeed ? auth.session?.user.id : undefined).then(list => { if (!cancelled) { feedOffset.current = list.length; setFeedVideos(list); setActiveId(list[0]?.id ?? null); setHasMore(list.length === PAGE_SIZE); } }).catch(() => { if (!cancelled) setFeedError('Could not load videos. Check your connection and try again.'); }).finally(() => { if (!cancelled) setFeedLoading(false); });
    return () => { cancelled = true; };
  }, [filter, reloadFeed, followingFeed, savedFeed, auth.session?.user.id]);
  const loadMore = async () => {
    if (!supabase || !hasMore || feedLoading || loadingMore.current) return;
    loadingMore.current = true;
    const generation = feedGeneration.current;
    try { const list = await loadFeed(feedOffset.current, filter.category, filter.search, followingFeed ? auth.session?.user.id : undefined, savedFeed ? auth.session?.user.id : undefined); if (generation !== feedGeneration.current) return; feedOffset.current += list.length; setFeedVideos(previous => [...previous, ...list.filter(v => !previous.some(p => p.id === v.id))]); setHasMore(list.length === PAGE_SIZE); }
    catch { if (generation === feedGeneration.current) Alert.alert('Could not load more videos', 'Please try again.'); }
    finally { loadingMore.current = false; }
  };
  const onLayout = useCallback((event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height), []);
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: { item: Video }[] }) => { setActiveId(activeIdFromViewable(viewableItems)); }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 75 }).current;
  const unavailable = (name: string) => Alert.alert(name, 'Coming in a later milestone. The feed is the first step.');
  return <View style={styles.root}>
    <StatusBar barStyle="light-content" />
    {screen === 'Profile' ? <ProfileScreen {...auth} onSaved={() => { setFollowingFeed(false); setSavedFeed(true); setFilter({ category: 'All', search: '' }); setScreen('Home'); }} /> : screen === 'Create' ? <UploadScreen session={auth.session} /> : screen === 'Discover' ? <DiscoverScreen onExplore={(category, search) => { setFollowingFeed(false); setSavedFeed(false); setFilter({ category, search }); setScreen('Home'); }} /> : <View style={styles.feed} onLayout={onLayout}>
      {height > 0 && (feedLoading ? <View style={styles.center}><ActivityIndicator color={orange} /><Text style={styles.status}>Loading your feed…</Text></View> : feedError ? <View style={styles.center}><Text style={styles.status}>{feedError}</Text><Pressable accessibilityRole="button" onPress={() => setReloadFeed(n => n + 1)}><Text style={styles.retry}>Try again</Text></Pressable></View> : feedVideos.length ? <FlatList key={`${filter.category}:${filter.search}`} data={feedVideos} keyExtractor={item => item.id} renderItem={({ item }) => <Card item={item} height={height} active={activeId === item.id} appActive={appActive} session={auth.session} demo={!supabase} />} pagingEnabled showsVerticalScrollIndicator={false} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig} onEndReached={loadMore} onEndReachedThreshold={1} initialNumToRender={1} windowSize={3} getItemLayout={(_, index) => ({ length: height, offset: height * index, index })} /> : <View style={styles.center}><Text style={styles.status}>No videos found. Try another search or follow some creators.</Text></View>)}
      {savedFeed && <Text style={styles.savedBadge}>Saved videos</Text>}
      <View style={styles.header} pointerEvents="box-none"><Text style={styles.logo}><Text style={{ color: orange }}>◒</Text> Sleer</Text><View style={styles.tabs}><Pressable onPress={() => { if (!supabase || !auth.session) Alert.alert('Sign in', 'Connect Supabase and sign in to see creators you follow.'); else { setFollowingFeed(true); setSavedFeed(false); setFilter({ category: 'All', search: '' }); } }}><Text style={followingFeed ? styles.tabActive : styles.tabInactive}>Following</Text>{followingFeed && <View style={styles.underline} />}</Pressable><Pressable onPress={() => { setFollowingFeed(false); setSavedFeed(false); setFilter({ category: 'All', search: '' }); }}><Text style={!followingFeed && !savedFeed ? styles.tabActive : styles.tabInactive}>For You</Text>{!followingFeed && !savedFeed && <View style={styles.underline} />}</Pressable></View><Pressable style={styles.search} accessibilityRole="button" accessibilityLabel="Search" onPress={() => setScreen('Discover')}><Ionicons name="search" color="white" size={26} /></Pressable></View>
    </View>}
    <View style={styles.nav}>{([['home', 'Home'], ['compass-outline', 'Discover'], ['add', 'Create'], ['notifications-outline', 'Activity'], ['person-circle-outline', 'Profile']] as [Icon, string][]).map(([icon, label]) => <Pressable key={label} accessibilityRole="button" accessibilityLabel={label} onPress={() => label === 'Home' || label === 'Profile' || label === 'Discover' || label === 'Create' ? setScreen(label) : unavailable(label)} style={styles.navItem}><View style={label === 'Create' ? styles.create : undefined}><Ionicons name={icon} size={label === 'Create' ? 30 : 25} color={label === 'Create' ? '#201711' : label === screen ? orange : '#c4bfbd'} /></View><Text style={[styles.navText, label === screen && { color: orange }]}>{label}</Text></Pressable>)}</View>
  </View>;
}

const styles = StyleSheet.create({
 root:{flex:1,backgroundColor:'#171c1b'},feed:{flex:1},header:{position:'absolute',top: Platform.OS === 'ios' ? 50 : 14,left:0,right:0,alignItems:'center'},logo:{fontSize:30,color:'white',fontWeight:'800',letterSpacing:-1},search:{position:'absolute',right:20,top:5},tabs:{flexDirection:'row',gap:32,marginTop:14},tabInactive:{color:'#c9c8c2',fontSize:16,fontWeight:'600'},tabActive:{color:'white',fontSize:16,fontWeight:'700'},underline:{height:3,backgroundColor:orange,borderRadius:4,marginTop:6},
 retryVideo:{position:'absolute',alignSelf:'center',top:'58%',padding:10,backgroundColor:'#181818dd',borderRadius:12},savedBadge:{position:'absolute',top:105,alignSelf:'center',color:'white',backgroundColor:'#0009',paddingHorizontal:12,paddingVertical:5,borderRadius:12},retry:{color:orange,marginTop:16,fontWeight:'700'},center:{...StyleSheet.absoluteFill,alignItems:'center',justifyContent:'center',padding:30},status:{color:'white',marginTop:10,textAlign:'center'},smallStatus:{color:'#ddd',marginTop:5},videoTouch:{...StyleSheet.absoluteFill,alignItems:'center',justifyContent:'center'},mute:{position:'absolute',top:120,right:20,backgroundColor:'#0008',padding:9,borderRadius:30},
 actions:{position:'absolute',right:14,bottom:50,alignItems:'center',gap:13},avatar:{width:46,height:46,borderRadius:23,backgroundColor:'#917053',borderWidth:2,borderColor:'white',alignItems:'center',justifyContent:'center',marginBottom:4},avatarText:{color:'white',fontWeight:'bold',fontSize:22},action:{alignItems:'center',gap:3},actionCircle:{width:44,height:44,borderRadius:22,backgroundColor:'#18181899',alignItems:'center',justifyContent:'center'},actionText:{fontSize:11,color:'white'},details:{position:'absolute',bottom:24,left:18,right:80},creator:{color:'white',fontWeight:'800',fontSize:17,marginBottom:6},caption:{color:'white',fontSize:16,lineHeight:22,marginBottom:10},tag:{backgroundColor:'#ffffff24',borderRadius:20,alignSelf:'flex-start',paddingVertical:6,paddingHorizontal:12,marginBottom:10},tagText:{color:'white',fontWeight:'600'},attribution:{color:'#ddd',fontSize:11,lineHeight:17},
 nav:{height:76,backgroundColor:'#211e1c',flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingBottom:Platform.OS === 'ios' ? 12 : 4},navItem:{width:64,alignItems:'center',justifyContent:'center',gap:3},navText:{fontSize:11,color:'#c4bfbd'},create:{width:43,height:43,borderRadius:22,backgroundColor:orange,alignItems:'center',justifyContent:'center'}
});
