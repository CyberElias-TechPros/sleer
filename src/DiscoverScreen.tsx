import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { categories } from './categories';
export function DiscoverScreen({ onExplore }: { onExplore: (category: string, search: string) => void }) {
  const [category, setCategory] = useState('All'); const [search, setSearch] = useState('');
  return <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.kicker}>FIND YOUR NEXT FAVORITE</Text><Text style={styles.title}>Discover</Text><Text style={styles.subtitle}>Explore the stories and creators in your world.</Text>
    <TextInput accessibilityLabel="Search captions" style={styles.input} placeholder="Search video captions" placeholderTextColor="#928a85" value={search} onChangeText={setSearch} maxLength={80} />
    <Text style={styles.heading}>Browse categories</Text><View style={styles.chips}>{categories.map(c => <Pressable accessibilityRole="button" key={c} onPress={() => setCategory(c)} style={[styles.chip, c === category && styles.selected]}><Text style={[styles.chipText, c === category && styles.selectedText]}>{c}</Text></Pressable>)}</View>
    <Pressable accessibilityRole="button" onPress={() => onExplore(category, search)} style={styles.button}><Text style={styles.buttonText}>Explore videos →</Text></Pressable>
    <Text style={styles.footnote}>Only approved videos appear. Search filters captions; categories depend on available content.</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#171816'},content:{padding:24,paddingTop:48},kicker:{color:'#ff874a',fontSize:11,fontWeight:'800',letterSpacing:2},title:{color:'white',fontSize:32,fontWeight:'800',marginTop:6},subtitle:{color:'#c9c1bc',lineHeight:22,marginTop:8},input:{backgroundColor:'#2b2825',color:'white',padding:15,borderRadius:12,marginTop:28,fontSize:16},heading:{fontSize:18,color:'white',fontWeight:'700',marginTop:30,marginBottom:14},chips:{flexDirection:'row',flexWrap:'wrap',gap:9},chip:{borderRadius:25,paddingHorizontal:17,paddingVertical:11,backgroundColor:'#302b28'},selected:{backgroundColor:'#ff874a'},chipText:{color:'#e4dcd6'},selectedText:{color:'#211813',fontWeight:'800'},button:{backgroundColor:'#ff874a',borderRadius:12,alignItems:'center',padding:16,marginTop:32},buttonText:{color:'#211813',fontWeight:'800',fontSize:16},footnote:{color:'#aaa29d',lineHeight:20,marginTop:18}});
