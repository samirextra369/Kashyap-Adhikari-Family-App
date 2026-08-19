import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type Notice = { id: string; title: string; detail: string; tone: 'gold' | 'green' };

const notices: Notice[] = [
  { id: '1', title: 'Welcome to Kashyap Family', detail: 'Your family story, kept together for generations.', tone: 'gold' },
  { id: '2', title: 'Family tree is growing', detail: 'You have 18 connected relatives in your branch.', tone: 'green' },
];

const events = [
  { date: '24', month: 'AUG', title: 'Family gathering', place: 'Pokhara · 10:00 AM', icon: 'users' as const },
  { date: '31', month: 'AUG', title: 'Goth Puja', place: 'Bindabasini Temple · 7:30 AM', icon: 'sun' as const },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [language, setLanguage] = useState<'EN' | 'ने'>('EN');
  const [refreshing, setRefreshing] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('kashyap-language').then((value) => {
      if (value === 'ने') setLanguage('ने');
    });
  }, []);

  const toggleLanguage = async () => {
    const next = language === 'EN' ? 'ने' : 'EN';
    setLanguage(next);
    await AsyncStorage.setItem('kashyap-language', next);
  };

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setRefreshing(false);
  };

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>KASHYAP FAMILY</Text>
            <Text style={[styles.greeting, { color: colors.foreground }]}>Namaste, Suman</Text>
          </View>
          <View style={styles.topActions}>
            <Pressable onPress={toggleLanguage} style={[styles.languagePill, { backgroundColor: colors.secondary }]} testID="language-toggle">
              <Text style={[styles.languageText, { color: colors.primary }]}>{language}</Text>
            </Pressable>
            <Pressable onPress={() => setSeen(false)} style={[styles.iconButton, { backgroundColor: colors.card }]} testID="notifications-button">
              <Ionicons name="notifications-outline" size={21} color={colors.foreground} />
              {seen ? <View style={[styles.dot, { backgroundColor: colors.accentForeground }]} /> : null}
            </Pressable>
          </View>
        </View>

        <Pressable style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.push('/family')} testID="search-family">
          <Feather name="search" size={19} color={colors.mutedForeground} />
          <Text style={[styles.searchText, { color: colors.mutedForeground }]}>Search your family</Text>
          <Feather name="sliders" size={17} color={colors.mutedForeground} />
        </Pressable>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your family story</Text>
          <Pressable onPress={() => router.push('/family')}><Text style={[styles.link, { color: colors.primary }]}>View tree</Text></Pressable>
        </View>
        <Pressable onPress={() => router.push('/family')} style={[styles.treeCard, { backgroundColor: colors.primary }]} testID="family-tree-card">
          <View style={styles.treeCopy}>
            <View style={styles.treeBadge}><Feather name="git-branch" size={17} color={colors.primary} /></View>
            <Text style={styles.treeTitle}>Explore your family tree</Text>
            <Text style={styles.treeSubtitle}>Trace roots, discover branches, and keep memories connected.</Text>
            <View style={styles.treeCta}><Text style={styles.treeCtaText}>Open my tree</Text><Feather name="arrow-up-right" size={16} color={colors.primary} /></View>
          </View>
          <View style={styles.treeGraphic}>
            <View style={styles.graphicLineVertical} />
            <View style={styles.graphicLineHorizontal} />
            <View style={[styles.graphicNode, styles.nodeTop]}><Text style={styles.nodeText}>H</Text></View>
            <View style={[styles.graphicNode, styles.nodeLeft]}><Text style={styles.nodeText}>M</Text></View>
            <View style={[styles.graphicNode, styles.nodeRight]}><Text style={styles.nodeText}>S</Text></View>
            <View style={[styles.graphicNode, styles.nodeBottom]}><Text style={styles.nodeText}>Y</Text></View>
          </View>
        </Pressable>

        <View style={styles.statsRow}>
          <Stat value="18" label="Connected" icon="users" colors={colors} />
          <Stat value="4" label="Generations" icon="layers" colors={colors} />
          <Stat value="2" label="Branches" icon="map-pin" colors={colors} />
        </View>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>For your family</Text>
          <Feather name="more-horizontal" size={20} color={colors.mutedForeground} />
        </View>
        <View style={styles.noticeList}>
          {notices.map((notice) => (
            <Pressable key={notice.id} style={[styles.notice, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setSeen(false)}>
              <View style={[styles.noticeIcon, { backgroundColor: notice.tone === 'gold' ? colors.accent : colors.secondary }]}>
                <Ionicons name={notice.tone === 'gold' ? 'sparkles-outline' : 'leaf-outline'} size={19} color={notice.tone === 'gold' ? colors.accentForeground : colors.primary} />
              </View>
              <View style={styles.noticeCopy}><Text style={[styles.noticeTitle, { color: colors.foreground }]}>{notice.title}</Text><Text style={[styles.noticeDetail, { color: colors.mutedForeground }]}>{notice.detail}</Text></View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming</Text>
          <Pressable><Text style={[styles.link, { color: colors.primary }]}>See all</Text></Pressable>
        </View>
        <View style={styles.eventList}>
          {events.map((event) => (
            <Pressable key={event.title} style={[styles.event, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.dateBox, { backgroundColor: colors.secondary }]}><Text style={[styles.date, { color: colors.primary }]}>{event.date}</Text><Text style={[styles.month, { color: colors.mutedForeground }]}>{event.month}</Text></View>
              <View style={styles.eventCopy}><Text style={[styles.eventTitle, { color: colors.foreground }]}>{event.title}</Text><Text style={[styles.eventPlace, { color: colors.mutedForeground }]}>{event.place}</Text></View>
              <Feather name="calendar" size={19} color={colors.accentForeground} />
            </Pressable>
          ))}
        </View>

        <View style={[styles.quote, { borderLeftColor: colors.accentForeground }]}>
          <Text style={[styles.quoteText, { color: colors.foreground }]}>“A family is a little world created by love.”</Text>
          <Text style={[styles.quoteCaption, { color: colors.mutedForeground }]}>Preserve the stories that make yours unique.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label, icon, colors }: { value: string; label: string; icon: keyof typeof Feather.glyphMap; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name={icon} size={17} color={colors.accentForeground} /><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 0 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  eyebrow: { fontSize: 11, letterSpacing: 1.8, fontWeight: '700', marginBottom: 6 },
  greeting: { fontSize: 27, fontWeight: '700', letterSpacing: -0.6 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  languagePill: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20 },
  languageText: { fontSize: 12, fontWeight: '700' },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dot: { position: 'absolute', width: 7, height: 7, borderRadius: 4, right: 10, top: 9 },
  search: { height: 48, borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 10, marginBottom: 27 },
  searchText: { fontSize: 14, flex: 1 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 },
  link: { fontSize: 13, fontWeight: '600' },
  treeCard: { borderRadius: 22, padding: 20, minHeight: 190, overflow: 'hidden', flexDirection: 'row', marginBottom: 12 },
  treeCopy: { flex: 1, zIndex: 2 },
  treeBadge: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#EAD7B7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  treeTitle: { color: '#FFF9EF', fontSize: 20, lineHeight: 25, fontWeight: '700', maxWidth: 190 },
  treeSubtitle: { color: '#D4E4D8', fontSize: 12, lineHeight: 18, marginTop: 7, maxWidth: 190 },
  treeCta: { alignSelf: 'flex-start', marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#F7F3EC', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20 },
  treeCtaText: { color: '#1F5B45', fontSize: 12, fontWeight: '700' },
  treeGraphic: { width: 118, height: 150, position: 'absolute', right: -6, top: 21, opacity: 0.75 },
  graphicLineVertical: { position: 'absolute', height: 105, width: 1, backgroundColor: '#A9C4AE', left: 58, top: 22 },
  graphicLineHorizontal: { position: 'absolute', width: 73, height: 1, backgroundColor: '#A9C4AE', left: 21, top: 75 },
  graphicNode: { position: 'absolute', width: 31, height: 31, borderRadius: 16, borderWidth: 2, borderColor: '#A9C4AE', backgroundColor: '#356F58', alignItems: 'center', justifyContent: 'center' },
  nodeText: { fontSize: 12, color: '#F7F3EC', fontWeight: '700' },
  nodeTop: { left: 43, top: 4 }, nodeLeft: { left: 5, top: 60 }, nodeRight: { right: 2, top: 60 }, nodeBottom: { left: 43, bottom: 2 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 25 },
  stat: { flex: 1, borderWidth: 1, borderRadius: 15, padding: 12, minHeight: 82 },
  statValue: { fontSize: 23, fontWeight: '700', marginTop: 8 },
  statLabel: { fontSize: 11, marginTop: 1 },
  noticeList: { gap: 9, marginBottom: 26 },
  notice: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11 },
  noticeIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  noticeCopy: { flex: 1 },
  noticeTitle: { fontWeight: '700', fontSize: 13, marginBottom: 3 },
  noticeDetail: { fontSize: 11, lineHeight: 16 },
  eventList: { gap: 9 },
  event: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dateBox: { width: 48, height: 52, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  date: { fontSize: 20, lineHeight: 22, fontWeight: '700' },
  month: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  eventCopy: { flex: 1 },
  eventTitle: { fontWeight: '700', fontSize: 14, marginBottom: 4 },
  eventPlace: { fontSize: 11 },
  quote: { borderLeftWidth: 3, paddingLeft: 14, marginTop: 30, marginBottom: 6 },
  quoteText: { fontSize: 15, lineHeight: 22, fontStyle: 'italic', fontWeight: '500' },
  quoteCaption: { fontSize: 11, marginTop: 5 },
});