import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Modal, TextInput, Dimensions,
  StatusBar, ActivityIndicator, Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, ScheherazadeNew_400Regular } from '@expo-google-fonts/scheherazade-new';
import colors from '../styles/colors';
import linesPages from '../data/mushaflinesIndex';
import navIndex from '../data/quranIndex.json';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const FONT_QURAN = 'ScheherazadeNew_400Regular';

const C = {
  bg:          colors.bgLight,
  bgPage:      colors.bgPaper || '#fffef9',
  primary:     colors.primary,
  primaryDark: colors.primaryDark,
  gold:        colors.secondary,
  text:        colors.textPrimary,
  textMuted:   colors.textSecondary,
  border:      colors.border,
  white:       colors.textLight,
};

// ── Rendu d'une ligne selon son type ──
const MushafLine = React.memo(({ line }) => {
  switch (line.t) {

    case 'header':
      return (
        <View style={styles.surahBanner}>
          <Text style={styles.bannerOrnament}>❖</Text>
          <Text style={styles.surahName}>سُورَةُ {line.v}</Text>
          <Text style={styles.bannerOrnament}>❖</Text>
        </View>
      );

    case 'bismillah':
      return (
        <Text style={styles.bismillahArt}>﷽</Text>
      );

    case 'empty':
      return <View style={styles.emptyLine} />;

    case 'text':
  default:
    // Entoure les chiffres arabes du caractère de fin d'ayah ۝
    const formatted = line.v?.replace(
      /[\u0660-\u0669]+/g,
      (num) => `\u06DD${num}`
    );
    return (
      <Text
        style={styles.quranLine}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        minimumFontScale={0.7}  // ← ne descend pas en dessous de 70% de 26 = 18px minimum
      >
        {line.v}
      </Text>
    );
  }
});

// ── Page du Mushaf ──
const MushafPage = React.memo(({ pageNum, fontsLoaded, onTap }) => {
  const data = useMemo(
    () => linesPages[pageNum] || linesPages[String(pageNum)] || null,
    [pageNum]
  );

  if (!fontsLoaded) {
    return (
      <TouchableWithoutFeedback onPress={onTap}>
        <View style={styles.pageContainer}>
          <ActivityIndicator color={C.gold} style={{ flex: 1 }} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // Page pas encore préparée
  if (!data) {
    return (
      <TouchableWithoutFeedback onPress={onTap}>
        <View style={styles.pageContainer}>
          <View style={[styles.pageBorder, styles.pageBorderLeft]} />
          <View style={[styles.pageBorder, styles.pageBorderRight]} />
          <View style={styles.pageInner}>
            <View style={styles.pendingContainer}>
              <Text style={styles.pendingText}>صفحة قيد الإعداد</Text>
              <Text style={styles.pendingPageNum}>{pageNum}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={onTap}>
      <View style={styles.pageContainer}>
        <View style={[styles.pageBorder, styles.pageBorderLeft]} />
        <View style={[styles.pageBorder, styles.pageBorderRight]} />

        <View style={styles.pageInner}>
          <View style={styles.linesContainer}>
            {data.lines.map(line => (
              <MushafLine key={line.l} line={line} />
            ))}
          </View>
          <Text style={styles.pageNumber}>{pageNum}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

// ── Drawer navigation ──
const NavDrawer = ({ visible, currentPage, onGoTo, onClose }) => {
  const [tab, setTab]             = useState('surah');
  const [jumpValue, setJumpValue] = useState('');

  const handleJump = () => {
    const n = parseInt(jumpValue);
    if (n >= 1 && n <= 604) { onGoTo(n); onClose(); }
  };

  const tabs = [
    { id: 'surah', label: 'سورة' },
    { id: 'juz',   label: 'جزء'  },
    { id: 'hizb',  label: 'حزب'  },
    { id: 'page',  label: 'صفحة' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.drawerBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.drawerContainer}>
        <View style={styles.drawerHandle} />

        <View style={styles.drawerTabs}>
          {tabs.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.drawerTab, tab === t.id && styles.drawerTabActive]}
              onPress={() => setTab(t.id)}
            >
              <Text style={[styles.drawerTabText, tab === t.id && styles.drawerTabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.drawerContent}>
          {tab === 'surah' && (
            <FlatList
              data={navIndex.surahs}
              keyExtractor={item => String(item.sura_no)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.drawerItem, item.first_page === currentPage && styles.drawerItemActive]}
                  onPress={() => { onGoTo(item.first_page); onClose(); }}
                >
                  <Text style={styles.drawerItemNum}>{item.sura_no}</Text>
                  <Text style={styles.drawerItemText}>{item.sura_name_ar}</Text>
                  <Text style={styles.drawerItemPage}>ص {item.first_page}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {tab === 'juz' && (
            <FlatList
              data={navIndex.juzs}
              numColumns={5}
              keyExtractor={item => String(item.juz_number)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.juzItem, item.first_page === currentPage && styles.juzItemActive]}
                  onPress={() => { onGoTo(item.first_page); onClose(); }}
                >
                  <Text style={[styles.juzItemText, item.first_page === currentPage && styles.juzItemTextActive]}>
                    {item.juz_number}
                  </Text>
                  <Text style={styles.juzLabel}>جزء</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {tab === 'hizb' && (
            <FlatList
              data={navIndex.hizbs}
              numColumns={5}
              keyExtractor={item => String(item.hizb_number)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.juzItem, item.first_page === currentPage && styles.juzItemActive]}
                  onPress={() => { onGoTo(item.first_page); onClose(); }}
                >
                  <Text style={[styles.juzItemText, item.first_page === currentPage && styles.juzItemTextActive]}>
                    {item.hizb_number}
                  </Text>
                  <Text style={styles.juzLabel}>حزب</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {tab === 'page' && (
            <View style={styles.pageJumpContainer}>
              <Text style={styles.pageJumpLabel}>انتقل إلى صفحة</Text>
              <TextInput
                style={styles.pageJumpInput}
                keyboardType="number-pad"
                value={jumpValue}
                onChangeText={setJumpValue}
                placeholder="1 - 604"
                maxLength={3}
                textAlign="center"
              />
              <TouchableOpacity style={styles.pageJumpBtn} onPress={handleJump}>
                <Text style={styles.pageJumpBtnText}>انتقل</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ── Écran principal ──
const QuranReadingScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    ScheherazadeNew_400Regular,
  });

  const flatListRef                   = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [navVisible, setNavVisible]   = useState(false);
  const [uiVisible, setUiVisible]     = useState(false);
  const fadeAnim                      = useRef(new Animated.Value(0)).current;

  const toggleUI = useCallback(() => {
    if (uiVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 250, useNativeDriver: true,
      }).start(() => setUiVisible(false));
    } else {
      setUiVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 250, useNativeDriver: true,
      }).start();
    }
  }, [uiVisible, fadeAnim]);

  const pages = useMemo(
    () => Array.from({ length: 604 }, (_, i) => i + 1),
    []
  );

  // Infos header : sourate, juz, hizb courants
  const surahName = useMemo(() =>
    navIndex.surahs.filter(s => s.first_page <= currentPage).pop()?.sura_name_ar || '',
    [currentPage]
  );
  const juzNum = useMemo(() =>
    navIndex.juzs.filter(j => j.first_page <= currentPage).pop()?.juz_number || '',
    [currentPage]
  );
  const hizbNum = useMemo(() =>
    navIndex.hizbs.filter(h => h.first_page <= currentPage).pop()?.hizb_number || '',
    [currentPage]
  );

  const goToPage = useCallback((pageNum) => {
    const mirrorIdx = 603 - (pageNum - 1);
    flatListRef.current?.scrollToIndex({ index: mirrorIdx, animated: false });
    setCurrentPage(pageNum);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const idx = viewableItems[0].index;
      setCurrentPage(604 - idx);
    }
  });

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const renderPage = useCallback(({ item: pageNum }) => (
    <MushafPage pageNum={pageNum} fontsLoaded={fontsLoaded} onTap={toggleUI} />
  ), [fontsLoaded, toggleUI]);

  const keyExtractor  = useCallback((item) => String(item), []);
  const getItemLayout = useCallback((_, index) => ({
    length: SCREEN_W, offset: SCREEN_W * index, index,
  }), []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={C.gold} />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.primaryDark} hidden={!uiVisible} />

      {/* Pages plein écran */}
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        inverted
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        initialScrollIndex={603}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        style={StyleSheet.absoluteFill}
      />

      {/* Header overlay */}
      {uiVisible && (
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerInner}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerMeta}>
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>جزء {juzNum}</Text>
                </View>
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>حزب {hizbNum}</Text>
                </View>
              </View>
              <Text style={styles.headerSurah} numberOfLines={1}>{surahName}</Text>
              <TouchableOpacity style={styles.navButton} onPress={() => setNavVisible(true)}>
                <Text style={styles.navButtonText}>☰</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}

      {/* Footer overlay */}
      {uiVisible && (
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <SafeAreaView edges={['bottom']}>
            <Text style={styles.footerPageNum}>{currentPage} / 604</Text>
          </SafeAreaView>
        </Animated.View>
      )}

      <NavDrawer
        visible={navVisible}
        currentPage={currentPage}
        onGoTo={goToPage}
        onClose={() => setNavVisible(false)}
      />
    </View>
  );
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: C.primaryDark, gap: 16,
  },
  loadingText: { color: C.gold, fontSize: 16 },

  screen: { flex: 1, backgroundColor: C.bgPage },

  // ── Page ──
  pageContainer: {
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: C.bgPage,
  },
  pageBorder: {
    position: 'absolute', top: 4, bottom: 4,
    width: 1, backgroundColor: C.gold + '50',
  },
  pageBorderLeft:  { left: 4 },
  pageBorderRight: { right: 4 },

  pageInner: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    justifyContent: 'space-between',
  },

  linesContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // ── Header sourate ──
  surahBanner: {
    backgroundColor: C.primary,
    borderWidth: 1,
    borderColor: C.gold,
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerOrnament: { color: C.gold, fontSize: 11 },
  surahName: {
    fontFamily: FONT_QURAN,
    fontSize: 17,
    fontWeight: '700',
    color: C.white,
    textAlign: 'center',
    flex: 1,
  },

  // ── Bismillah artistique ──
  bismillahArt: {
    fontFamily: FONT_QURAN,
    fontSize: 34,
    color: C.text,
    textAlign: 'center',
    includeFontPadding: false,
  },

  // ── Ligne vide ──
  emptyLine: { height: 20 },

  // ── Ligne coranique ──
  quranLine: {
    fontFamily: FONT_QURAN,
    fontSize: 26,
    color: C.text,
    textAlign: 'center',
    writingDirection: 'rtl',
    includeFontPadding: false,
  },

  // ── Numéro de page ──
  pageNumber: {
    textAlign: 'center',
    color: C.textMuted,
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 1,
  },

  // ── Page en attente ──
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  pendingText: {
    fontSize: 18,
    color: C.textMuted,
    fontWeight: '600',
  },
  pendingPageNum: {
    fontSize: 32,
    color: C.gold,
    fontWeight: '700',
  },

  // ── Header overlay ──
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: C.primary,
    borderBottomWidth: 1, borderBottomColor: C.gold + '55',
    zIndex: 10,
  },
  headerInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10,
  },
  backButton:     { padding: 8 },
  backButtonText: { fontSize: 22, color: C.gold, fontWeight: 'bold' },
  headerMeta:     { flexDirection: 'row', gap: 4 },
  metaBadge: {
    backgroundColor: C.gold + '25',
    borderWidth: 1, borderColor: C.gold + '66',
    borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2,
  },
  metaBadgeText: { color: C.gold, fontSize: 11 },
  headerSurah: {
    flex: 1, color: C.white, fontSize: 16,
    textAlign: 'center', marginHorizontal: 6,
  },
  navButton: {
    padding: 8, borderWidth: 1,
    borderColor: C.gold + '55', borderRadius: 4,
  },
  navButtonText: { color: C.gold, fontSize: 16 },

  // ── Footer overlay ──
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.primaryDark,
    borderTopWidth: 1, borderTopColor: C.gold + '33',
    alignItems: 'center', paddingVertical: 8,
    zIndex: 10,
  },
  footerPageNum: { color: C.gold, fontSize: 13, letterSpacing: 2 },

  // ── Drawer ──
  drawerBackdrop:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  drawerContainer: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    borderTopWidth: 2, borderTopColor: C.gold,
    maxHeight: SCREEN_H * 0.65, paddingBottom: 20,
  },
  drawerHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.gold + '66',
    alignSelf: 'center', marginVertical: 10,
  },
  drawerTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingHorizontal: 16,
  },
  drawerTab: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  drawerTabActive:     { borderBottomColor: C.primary },
  drawerTabText:       { fontSize: 16, color: C.textMuted },
  drawerTabTextActive: { color: C.primary, fontWeight: '700' },
  drawerContent:       { flex: 1, paddingHorizontal: 12, paddingTop: 8 },

  drawerItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 9, paddingHorizontal: 12,
    borderRadius: 6, marginBottom: 3,
    borderWidth: 1, borderColor: C.border,
    backgroundColor: C.bg,
  },
  drawerItemActive: { backgroundColor: C.primary + '15', borderColor: C.primary },
  drawerItemNum:    { fontSize: 12, color: C.textMuted, width: 24, textAlign: 'center' },
  drawerItemText:   { flex: 1, fontSize: 16, color: C.text, textAlign: 'right', marginRight: 8 },
  drawerItemPage:   { fontSize: 11, color: C.textMuted },

  juzItem: {
    flex: 1, margin: 3, paddingVertical: 10,
    borderRadius: 6, borderWidth: 1,
    borderColor: C.border, backgroundColor: C.bg, alignItems: 'center',
  },
  juzItemActive:     { backgroundColor: C.primary + '15', borderColor: C.primary },
  juzItemText:       { fontSize: 17, color: C.text },
  juzItemTextActive: { color: C.primary, fontWeight: '700' },
  juzLabel:          { fontSize: 9, color: C.textMuted },

  pageJumpContainer: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 16,
  },
  pageJumpLabel: { fontSize: 15, color: C.textMuted },
  pageJumpInput: {
    width: 72, paddingVertical: 7, paddingHorizontal: 10,
    borderRadius: 6, borderWidth: 1, borderColor: C.gold,
    backgroundColor: C.white, fontSize: 16, color: C.text,
  },
  pageJumpBtn: {
    paddingHorizontal: 18, paddingVertical: 7,
    borderRadius: 6, backgroundColor: C.primary,
  },
  pageJumpBtnText: { fontSize: 15, color: C.white },
});

export default QuranReadingScreen;