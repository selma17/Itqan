import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Clipboard,
  Image,
  Modal,
  ScrollView,
  FlatList,
  Dimensions,
  Linking,
  Share,
  Alert,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../styles/colors';
import duaaData from '../data/duaa.json';

const { width } = Dimensions.get('window');

// ─── Carousel geometry ───────────────────────────────────────────────
// Each FlatList slot has the same width = ITEM_WIDTH
// The visible card inside scales between SIDE_W and CENTER_W
const CENTER_W      = width * 0.50;
const SIDE_W        = width * 0.30;
const ITEM_WIDTH    = SIDE_W + 12;          // slot width (side card + gap)
const SIDE_H        = 170;
const CENTER_H      = 215;

// padding so slot[0] left-edge positions its card at screen center
const SIDE_INSET    = (width - CENTER_W) / 2;

// ─── Infinite carousel data ──────────────────────────────────────────
// order: tajweed(0) tadabor(1) tests(2) mutashab(3) duaa(4) errors(5)
const REAL_SECTIONS = [
  { id: 'tajweed',  emoji: '🎵', title: 'التجويد',     desc: 'قواعد التلاوة',    accent: false, onPress: () => {} },
  { id: 'tadabor',  emoji: '📖', title: 'تدبر القرآن', desc: 'تأمّل في الآيات',   accent: false, onPress: () => {} },
  { id: 'tests',    emoji: '🎯', title: 'الاختبارات',  desc: 'اختبر حفظك',       accent: true,  onPress: null },
  { id: 'mutashab', emoji: '🔀', title: 'المتشابهات',  desc: 'الآيات المتشابهة', accent: false, onPress: () => {} },
  { id: 'duaa2',    emoji: '🤲', title: 'أدعية',       desc: 'أدعية مأثورة',     accent: false, onPress: () => {} },
  { id: 'errors',   emoji: '⚠️', title: 'أخطاؤك',     desc: 'راجع أخطاءك',      accent: false, onPress: () => {} },
];
const N          = REAL_SECTIONS.length;
const MULT       = 200;           // enough to never reach the end
const INF_DATA   = Array.from({ length: N * MULT }, (_, i) => ({
  ...REAL_SECTIONS[i % N],
  _key: String(i),
  _flatIndex: i,
  _realIndex: i % N,
}));

const INITIAL_REAL  = 2;                            // tests
const INITIAL_FLAT  = Math.floor(MULT / 2) * N + INITIAL_REAL;
const INITIAL_OFFSET = INITIAL_FLAT * ITEM_WIDTH;

// ─────────────────────────────────────────────────────────────────────

const MainScreen = ({ navigation }) => {
  const [activeTab, setActiveTab]           = useState('home');
  const [menuVisible, setMenuVisible]       = useState(false);
  const [aboutVisible, setAboutVisible]     = useState(false);
  const [activeRealIndex, setActiveRealIndex] = useState(INITIAL_REAL);

  const flatRef  = useRef(null);
  const scrollX  = useRef(new Animated.Value(INITIAL_OFFSET)).current;

  useEffect(() => {
    requestAnimationFrame(() => {
      flatRef.current?.scrollToOffset({ offset: INITIAL_OFFSET, animated: false });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setActiveTab('home');
    }, [])
  );

  const randomDuaa = useMemo(() => {
    const d = new Date();
    return duaaData[Math.floor(d.getTime() / 86400000) % duaaData.length];
  }, []);

  const BUG_URL    = 'https://forms.gle/SFbAtd3WfLc2gCJDA';
  const UPDATE_URL = 'https://forms.gle/R7pZgFxbzTXsUaSY8';
  const STORE_URL  = 'https://play.google.com/store/apps/details?id=com.selma.itqan';

  const openURL = async (url) => {
    try { if (await Linking.canOpenURL(url)) await Linking.openURL(url); } catch {}
  };

  const handleTabPress = (tab) => {
    if (tab === 'quran') navigation.navigate('QuranReading');
    else if (tab === 'settings') navigation.navigate('Settings');
    else setActiveTab(tab);
  };

  const handleCardPress = useCallback((item) => {
    if (item.id === 'tests') navigation.navigate('Tests');
    else if (item.onPress) item.onPress();
  }, [navigation]);

  const onMomentumScrollEnd = useCallback((e) => {
    const flatIdx = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setActiveRealIndex(flatIdx % N);
  }, []);

  // ── render card ──
  const renderCard = useCallback(({ item }) => {
    const fi = item._flatIndex;
    const inputRange = [(fi - 1) * ITEM_WIDTH, fi * ITEM_WIDTH, (fi + 1) * ITEM_WIDTH];

    const cardW = scrollX.interpolate({
      inputRange, outputRange: [SIDE_W, CENTER_W, SIDE_W], extrapolate: 'clamp',
    });
    const cardH = scrollX.interpolate({
      inputRange, outputRange: [SIDE_H, CENTER_H, SIDE_H], extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange, outputRange: [0.45, 1, 0.45], extrapolate: 'clamp',
    });
    const scale = scrollX.interpolate({
      inputRange, outputRange: [0.84, 1, 0.84], extrapolate: 'clamp',
    });

    const isAccent = item.accent;

    return (
      // Outer slot — fixed ITEM_WIDTH, card animates inside it
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleCardPress(item)}
        style={styles.cardSlot}
      >
        <Animated.View style={[
          styles.card,
          isAccent ? styles.cardAccent : styles.cardNeutral,
          { width: cardW, height: cardH, opacity, transform: [{ scale }] },
        ]}>
          <View style={[styles.cardStripe, isAccent ? styles.cardStripeAccent : styles.cardStripeNeutral]} />
          <View style={[styles.cornerDiamond, isAccent ? styles.cornerDiamondAccent : styles.cornerDiamondNeutral]} />

          <View style={[styles.cardIconWrap, isAccent ? styles.cardIconWrapAccent : styles.cardIconWrapNeutral]}>
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
          </View>

          <Text style={[styles.cardTitle, isAccent ? styles.cardTitleAccent : styles.cardTitleNeutral]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.cardDesc, isAccent ? styles.cardDescAccent : styles.cardDescNeutral]} numberOfLines={1}>
            {item.desc}
          </Text>

          <View style={[styles.cardArrow, isAccent ? styles.cardArrowAccent : styles.cardArrowNeutral]}>
            <Text style={[styles.cardArrowTxt, isAccent ? styles.cardArrowTxtAccent : styles.cardArrowTxtNeutral]}>←</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }, [scrollX, handleCardPress]);

  // ── dots ──
  const dots = REAL_SECTIONS.map((_, i) => (
    <View key={i} style={[styles.dot, i === activeRealIndex ? styles.dotActive : styles.dotInactive]} />
  ));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ══ HEADER — NE PAS TOUCHER ══ */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <View style={styles.menuLine} /><View style={styles.menuLine} /><View style={styles.menuLine} />
        </TouchableOpacity>
        <View style={styles.ornamentTop} />
        <Text style={styles.mainTitle}> إتقان </Text>
        <Text style={styles.subtitle}>دليلك في حفظ القرآن و تدبّره</Text>
        <View style={styles.ornamentBottom} />
      </View>

      {/* ══ CONTENT ══ */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── DUAA CARD ── */}
        <View style={styles.duaaCard}>
          <View style={styles.duaaGoldBar} />
          <View style={styles.duaaInner}>
            <View style={styles.duaaHeaderRow}>
              <View style={styles.duaaLine} />
              <View style={styles.duaaDiamond} />
              <Text style={styles.duaaHeaderTitle}>دعاء اليوم</Text>
              <View style={styles.duaaDiamond} />
              <View style={styles.duaaLine} />
            </View>
            <Text style={styles.duaaText}>{'\u201D'}{randomDuaa.text}{'\u201C'}</Text>
            <View style={styles.duaaFooterRow}>
              <View style={styles.duaaActionsRow}>
                <TouchableOpacity style={styles.duaaBtn}
                  onPress={() => Share.share({ message: randomDuaa.text + '\n— ' + randomDuaa.source, title: 'دعاء اليوم' })}>
                  <Text style={styles.duaaBtnIcon}>{'<'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.duaaBtn}
                  onPress={() => { Clipboard.setString(randomDuaa.text + '\n— ' + randomDuaa.source); Alert.alert('', 'تم النسخ ✓'); }}>
                  <Text style={styles.duaaBtnIcon}>⧉</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.duaaSource}>{randomDuaa.source}</Text>
            </View>
          </View>
        </View>

        {/* ── CAROUSEL ── */}
        <View style={styles.carouselWrapper}>
          <Animated.FlatList
            ref={flatRef}
            data={INF_DATA}
            keyExtractor={(item) => item._key}
            horizontal
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            // Each slot is ITEM_WIDTH wide, snap on that interval
            snapToInterval={ITEM_WIDTH}
            snapToAlignment="start"
            decelerationRate={0.9}
            bounces={false}
            // Left padding pushes slot[0] so its center aligns with screen center
            contentContainerStyle={{ 
              paddingLeft: SIDE_INSET - ITEM_WIDTH / 2 + CENTER_W / 2,
              paddingRight: SIDE_INSET - ITEM_WIDTH / 2 + CENTER_W / 2
            }}           
            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH,
              offset: ITEM_WIDTH * index,
              index,
            })}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={renderCard}
            initialNumToRender={7}
            maxToRenderPerBatch={7}
            windowSize={5}
          />
        </View>

        {/* dots */}
        <View style={styles.dotsRow}>{dots}</View>

        {/* ── INSTRUCTIONS BANNER ── */}
        <View style={styles.instrWrapper}>
          <TouchableOpacity style={styles.instrBanner} activeOpacity={0.82} onPress={() => {}}>
            <Text style={styles.instrArrow}>←</Text>
            <Text style={styles.instrText}>تعليمات التطبيق</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ══ TAB BAR ══ */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('settings')}>
          <View style={[styles.tabIconWrap, activeTab === 'settings' && styles.tabIconWrapActive]}>
            <Text style={styles.tabIconEmoji}>⚙️</Text>
          </View>
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>الإعدادات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, styles.tabItemCenter]} onPress={() => handleTabPress('home')}>
          <View style={[styles.tabHomeBtn, activeTab === 'home' && styles.tabHomeBtnActive]}>
            <Text style={styles.tabHomeIcon}>🏠</Text>
          </View>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>الرئيسية</Text>
          {activeTab === 'home' && <View style={styles.tabActiveDot} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => handleTabPress('quran')}>
          <View style={[styles.tabIconWrap, activeTab === 'quran' && styles.tabIconWrapActive]}>
            <Text style={styles.tabIconEmoji}>📖</Text>
          </View>
          <Text style={[styles.tabLabel, activeTab === 'quran' && styles.tabLabelActive]}>المصحف</Text>
        </TouchableOpacity>
      </View>

      {/* ══ MENU LATÉRAL ══ */}
      <Modal visible={menuVisible} transparent animationType="slide" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <TouchableOpacity style={styles.sideMenu} activeOpacity={1}>
            <View style={styles.menuHeader}>
              <TouchableOpacity style={styles.closeMenuButton} onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeMenuIcon}>✕</Text>
              </TouchableOpacity>
              <Image source={require('../../assets/itqanIconNoBg.png')} style={styles.appIconImage} />
              <Text style={styles.appVersion}>v1.0.0</Text>
            </View>
            <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>اتصل بنا</Text>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); openURL(BUG_URL); }}>
                  <View style={styles.menuItemContent}><Text style={styles.menuItemIcon}>📧</Text><Text style={styles.menuItemText}>الإبلاغ عن خلل</Text></View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); openURL(UPDATE_URL); }}>
                  <View style={styles.menuItemContent}><Text style={styles.menuItemIcon}>🔄</Text><Text style={styles.menuItemText}>اقتراح تحديث</Text></View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>عن التطبيق</Text>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); openURL(STORE_URL); }}>
                  <View style={styles.menuItemContent}><Text style={styles.menuItemIcon}>⭐</Text><Text style={styles.menuItemText}>قيّم التطبيق</Text></View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={async () => { setMenuVisible(false); try { await Share.share({ message: `شارك التطبيق\n${STORE_URL}`, title: 'إتقان - Itqan' }); } catch {} }}>
                  <View style={styles.menuItemContent}><Text style={styles.menuItemIcon}>📤</Text><Text style={styles.menuItemText}>شارك التطبيق</Text></View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => setAboutVisible(true), 300); }}>
                  <View style={styles.menuItemContent}><Text style={styles.menuItemIcon}>ℹ️</Text><Text style={styles.menuItemText}>عن إتقان</Text></View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ══ MODAL À PROPOS ══ */}
      <Modal visible={aboutVisible} transparent animationType="fade" onRequestClose={() => setAboutVisible(false)}>
        <View style={styles.aboutModalOverlay}>
          <View style={styles.aboutCard}>
            <TouchableOpacity style={styles.closeAboutButton} onPress={() => setAboutVisible(false)}>
              <Text style={styles.closeAboutIcon}>✕</Text>
            </TouchableOpacity>
            <View style={styles.aboutIconContainer}>
              <Image source={require('../../assets/itqanIcon.png')} style={styles.aboutIconImage} resizeMode="contain" />
            </View>
            <Text style={styles.aboutTitle}>عن إتقان</Text>
            <View style={styles.aboutDivider} />
            <ScrollView style={styles.aboutContentScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.aboutText}>
                بسم الله الرحمن الرحيم{'\n\n'}إتقان هو تطبيق مخصص لاختبار ومراجعة حفظ القرآن الكريم برواية قالون عن نافع المدني.{'\n\n'}يوفر التطبيق عدة أنماط للاختبار:{'\n'}• مواضع في سورة معينة{'\n'}• مواضع في صفحات معينة{'\n'}• مواضع في حزب معيّن{'\n'}• إنشاء اختبار مخصص{'\n\n'}الهدف من التطبيق هو مساعدة حفظة القرآن الكريم على تثبيت حفظهم ومراجعة ما حفظوه بطريقة منظمة وممتعة.{'\n\n'}نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم.{'\n\n'}جميع الحقوق محفوظة © 2026
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.aboutOkButton} onPress={() => setAboutVisible(false)}>
              <Text style={styles.aboutOkButtonText}>حسناً</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight },

  // ══ HEADER ══
  headerContainer: { backgroundColor: colors.primary, paddingTop: 30, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 10, marginBottom: -20 },
  ornamentTop: { width: 60, height: 3, backgroundColor: colors.secondary, alignSelf: 'center', borderRadius: 2, marginBottom: 15 },
  mainTitle: { fontSize: 35, fontWeight: '800', color: colors.textLight, textAlign: 'center', marginBottom: 5, letterSpacing: 0.5 },
  subtitle: { fontSize: 18, fontWeight: '500', color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 15 },
  ornamentBottom: { width: 40, height: 3, backgroundColor: colors.secondary, alignSelf: 'center', borderRadius: 2 },
  menuButton: { position: 'absolute', top: 30, right: 25, width: 20, height: 40, justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8, zIndex: 10 },
  menuLine: { width: 28, height: 3, backgroundColor: colors.secondary, borderRadius: 2 },

  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 30, paddingBottom: 8 },

  // ── DUAA CARD ──
  duaaCard: { backgroundColor: colors.bgPaper, borderRadius: 20, marginHorizontal: 18, marginBottom: 15, marginTop: 20, borderWidth: 1.5, borderColor: 'rgba(212,175,55,0.32)', shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 4, overflow: 'hidden' },
  duaaGoldBar: { height: 4, backgroundColor: colors.secondary },
  duaaInner: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14 },
  duaaHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  duaaLine: { flex: 1, height: 0.5, backgroundColor: colors.secondary, opacity: 0.5 },
  duaaDiamond: { width: 5, height: 5, backgroundColor: colors.secondary, transform: [{ rotate: '45deg' }], opacity: 0.75 },
  duaaHeaderTitle: { fontSize: 13, color: 'rgba(45,90,62,0.55)', fontWeight: '600', fontFamily: 'ScheherazadeNew_400Regular', letterSpacing: 1.5 },
  duaaText: { fontSize: 20, color: colors.textPrimary, textAlign: 'center', lineHeight: 34, fontFamily: 'ScheherazadeNew_400Regular', writingDirection: 'rtl', marginBottom: 12 },
  duaaFooterRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: 'rgba(212,175,55,0.2)', paddingTop: 10 },
  duaaActionsRow: { flexDirection: 'row', gap: 6 },
  duaaBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 0.5, borderColor: 'rgba(45,90,62,0.15)', backgroundColor: 'rgba(45,90,62,0.04)', justifyContent: 'center', alignItems: 'center' },
  duaaBtnIcon: { fontSize: 13, color: 'rgba(45,90,62,0.55)' },
  duaaSource: { flex: 1, fontSize: 12, color: colors.secondary, fontStyle: 'italic', fontFamily: 'ScheherazadeNew_400Regular', textAlign: 'center' },

  // ── CAROUSEL ──
  carouselWrapper: {
    height: CENTER_H + 16,
    justifyContent: 'center',
    overflow: 'hidden',          // cards can exceed wrapper during scale
    marginTop: 8,
  },

  // Each FlatList item occupies a fixed ITEM_WIDTH slot
  cardSlot: {
    width: ITEM_WIDTH,
    height: CENTER_H,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: 12,
  },
  cardAccent: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8},
  cardNeutral: { backgroundColor: colors.bgPaper, borderWidth: 1.5, borderColor: 'rgba(212,175,55,0.3)', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.09, shadowRadius: 12, elevation: 4 },

  cardStripe: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  cardStripeAccent:  { backgroundColor: colors.secondary },
  cardStripeNeutral: { backgroundColor: 'rgba(212,175,55,0.45)' },

  cornerDiamond: { position: 'absolute', top: 10, left: 12, width: 7, height: 7, transform: [{ rotate: '45deg' }] },
  cornerDiamondAccent:  { backgroundColor: 'rgba(212,175,55,0.4)' },
  cornerDiamondNeutral: { backgroundColor: 'rgba(212,175,55,0.35)' },

  cardIconWrap: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 22, marginBottom: 10 },
  cardIconWrapAccent:  { backgroundColor: 'rgba(212,175,55,0.18)' },
  cardIconWrapNeutral: { backgroundColor: 'rgba(45,90,62,0.07)' },
  cardEmoji: { fontSize: 26 },

  cardTitle: { fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 3, paddingHorizontal: 6 },
  cardTitleAccent:  { color: colors.secondary },
  cardTitleNeutral: { color: colors.primary },

  cardDesc: { fontSize: 11, textAlign: 'center', paddingHorizontal: 6, marginBottom: 14 },
  cardDescAccent:  { color: 'rgba(255,255,255,0.6)' },
  cardDescNeutral: { color: colors.textSecondary },

  cardArrow: { position: 'absolute', bottom: 12, left: 12, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  cardArrowAccent:  { backgroundColor: 'rgba(212,175,55,0.2)' },
  cardArrowNeutral: { backgroundColor: 'rgba(45,90,62,0.08)' },
  cardArrowTxt: { fontSize: 13, fontWeight: 'bold' },
  cardArrowTxtAccent:  { color: colors.secondary },
  cardArrowTxtNeutral: { color: colors.primary },

  // ── DOTS ──
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 18 },
  dot: { height: 6, borderRadius: 3 },
  dotActive:   { width: 20, backgroundColor: colors.secondary },
  dotInactive: { width: 6,  backgroundColor: 'rgba(45,90,62,0.2)' },

  // ── INSTRUCTIONS ──
  instrWrapper: { alignItems: 'center', marginBottom: 4 },
  instrBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.5)', borderRadius: 30, paddingVertical: 5, paddingHorizontal: 28 },
  instrText:  { fontSize: 15, color: colors.primary, fontWeight: '600' },
  instrArrow: { fontSize: 15, color: colors.secondary, fontWeight: 'bold' },

  // ══ TAB BAR ══
  tabBar: { flexDirection: 'row', backgroundColor: colors.bgWhite, borderTopWidth: 0.5, borderTopColor: colors.borderLight, paddingBottom: 10, paddingTop: 8, paddingHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabItemCenter: { marginTop: -18 },
  tabIconWrap: { width: 40, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  tabIconWrapActive: { backgroundColor: 'rgba(45,90,62,0.1)' },
  tabIconEmoji: { fontSize: 21 },
  tabLabel: { fontSize: 10, fontWeight: '500', color: colors.textSecondary },
  tabLabelActive: { color: colors.primary, fontWeight: '700' },
  tabHomeBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.bgLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: colors.borderLight, marginBottom: 2, shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 5 },
  tabHomeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary, shadowOpacity: 0.28 },
  tabHomeIcon: { fontSize: 24 },
  tabActiveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.secondary, marginTop: 1 },

  // ══ MENU ══
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  sideMenu: { width: width * 0.6, height: '100%', backgroundColor: colors.bgWhite, shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 15 },
  menuHeader: { backgroundColor: colors.primary, paddingTop: 10, paddingBottom: 25, paddingHorizontal: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.borderLight, height: 200 },
  closeMenuButton: { position: 'absolute', top: 20, left: 10, width: 25, height: 25, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  closeMenuIcon: { fontSize: 15, color: colors.borderLight, fontWeight: 'bold' },
  appIconImage: { width: 200, height: 150 },
  appVersion: { fontSize: 15, color: colors.secondary, fontWeight: '700' },
  menuContent: { flex: 1, backgroundColor: colors.bgLight },
  menuSection: { marginTop: 12, paddingVertical: 8, marginHorizontal: 7, borderWidth: 1.5, borderRadius: 15, borderColor: colors.secondary },
  sectionTitle: { fontSize: 25, fontWeight: '600', color: colors.textSecondary, textAlign: 'right', paddingHorizontal: 20, paddingVertical: 8 },
  menuItem: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 15, marginHorizontal: 10, marginVertical: 3, borderWidth: 1.5, borderRadius: 15, borderColor: colors.borderLight, backgroundColor: colors.bgWhite },
  menuItemContent: { flexDirection: 'row-reverse', alignItems: 'center', flex: 1, gap: 12 },
  menuItemIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  menuItemText: { flex: 1, fontSize: 16, color: colors.textPrimary, textAlign: 'right' },
  menuItemArrow: { fontSize: 24, color: colors.textSecondary, marginLeft: 8 },

  // ══ ABOUT MODAL ══
  aboutModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  aboutCard: { width: '100%', maxWidth: 500, backgroundColor: colors.bgWhite, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 12, borderWidth: 2, borderColor: colors.secondary, maxHeight: '85%' },
  closeAboutButton: { position: 'absolute', top: 16, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgLight, justifyContent: 'center', alignItems: 'center', zIndex: 10, borderWidth: 1, borderColor: colors.borderLight },
  closeAboutIcon: { fontSize: 18, color: colors.textPrimary, fontWeight: 'bold' },
  aboutIconContainer: { width: 80, height: 80, borderRadius: 20, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 20, marginBottom: 16, borderWidth: 3, borderColor: colors.secondary, overflow: 'hidden' },
  aboutIconImage: { width: 80, height: 80 },
  aboutTitle: { fontSize: 26, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: 12 },
  aboutDivider: { width: 60, height: 3, backgroundColor: colors.secondary, alignSelf: 'center', borderRadius: 2, marginBottom: 20 },
  aboutContentScroll: { maxHeight: 400, marginBottom: 20 },
  aboutText: { fontSize: 16, color: colors.textPrimary, textAlign: 'right', lineHeight: 28, writingDirection: 'rtl' },
  aboutOkButton: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 14, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  aboutOkButtonText: { fontSize: 18, fontWeight: '600', color: colors.textLight },
});

export default MainScreen;