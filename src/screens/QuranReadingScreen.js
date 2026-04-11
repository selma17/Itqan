import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Modal, TextInput, Dimensions,
  StatusBar, Animated, TouchableWithoutFeedback,
  Image, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';
import quranImages from '../data/quranImagesIndex';
import navIndex from '../data/quranIndex.json';
import { useQuran } from '../context/QuranContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, ScheherazadeNew_400Regular } from '@expo-google-fonts/scheherazade-new';
console.log('navIndex surahs:', navIndex?.surahs?.length);
console.log('navIndex hizbs:', navIndex?.hizbs?.length);
console.log('navIndex juzs:', navIndex?.juzs?.length);

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const C = {
  bg:          colors.bgLight,
  primary:     colors.primary,
  primaryDark: colors.primaryDark,
  gold:        colors.secondary,
  text:        colors.textPrimary,
  textMuted:   colors.textSecondary,
  border:      colors.border,
  white:       colors.textLight,
};

const FONT_UI       = 'ScheherazadeNew_400Regular';
const BOOKMARKS_KEY = '@itqan_mushaf_bookmarks';
const getSurahName = (p) => {
  const onThisPage = navIndex.surahs.filter(s => s.first_page === p);
  if (onThisPage.length > 0) {
    return onThisPage.map(s => s.sura_name_ar).join(' • ');
  }
  return navIndex.surahs.filter(s => s.first_page <= p).pop()?.sura_name_ar || '';
};
const getHizbNum    = (p) => navIndex.hizbs.filter(h => h.first_page <= p).pop()?.hizb_number  || '';

// ── Premier verset d'un hizb ──
const getFirstVerseOfHizb = (hizbNum, data) => {
  const hizbInfo = navIndex.hizbs.find(h => h.hizb_number === hizbNum);
  if (!hizbInfo || !data) return '';
  const aya = data.find(a => parseInt(a.page) === hizbInfo.first_page);
  return aya ? aya.aya_text.slice(0, 40) + '...' : '';
};

// ── Premier verset d'un juz ──
const getFirstVerseOfJuz = (juzNum, data) => {
  const juzInfo = navIndex.juzs.find(j => j.juz_number === juzNum);
  if (!juzInfo || !data) return '';
  const aya = data.find(a => parseInt(a.page) === juzInfo.first_page);
  return aya ? aya.aya_text.slice(0, 40) + '...' : '';
};

// ── Page du Mushaf ──
const MushafPage = React.memo(({ pageNum, onTap, bookmarks, fontsLoaded }) => {
  const image      = useMemo(() => quranImages[pageNum] || quranImages[String(pageNum)] || null, [pageNum]);
  const surahName  = useMemo(() => getSurahName(pageNum), [pageNum]);
  const hizbNum    = useMemo(() => getHizbNum(pageNum),   [pageNum]);
  const isOdd      = pageNum % 2 !== 0;
  const isBookmark = bookmarks.includes(pageNum);
  const isSpecial  = pageNum === 1 || pageNum === 2;

  return (
    <TouchableWithoutFeedback onPress={onTap}>
      <View style={styles.pageContainer}>
        {image ? (
          <Image
            source={image}
            style={[styles.pageImage, isSpecial && styles.pageImageSpecial]}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>صفحة غير متوفرة</Text>
            <Text style={styles.pendingPageNum}>{pageNum}</Text>
          </View>
        )}

        {/* Signet décoratif */}
        <View style={[styles.signet, isOdd ? styles.signetRight : styles.signetLeft]}>
          <View style={styles.signetBody} />
          <View style={styles.signetTip} />
        </View>

        {/* Marque-page actif */}
        {isBookmark && (
          <View style={[styles.bookmarkMark, isOdd ? styles.signetRight : styles.signetLeft]}>
            <Image source={require('../../assets/bookmark_filled.png')} style={styles.bookmarkIcon} />
          </View>
        )}

        {/* Infos overlay */}
        {fontsLoaded && (
          <>
            <View style={styles.surahOverlay}>
              <Text style={styles.surahOverlayText}>{surahName}</Text>
            </View>
            <View style={styles.hizbOverlay}>
              <Text style={styles.hizbOverlayText}>حزب {hizbNum}</Text>
            </View>
            <View style={styles.pageNumOverlay}>
              <Text style={styles.pageNumOverlayText}>{pageNum}</Text>
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
});

// ── Panneau Navigation (sourates / hizbs / juz) ──
const NavigationPanel = ({ visible, currentPage, onGoTo, onClose, rawData }) => {
  const [tab, setTab]       = useState('surah');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'surah', label: 'السور'    },
    { id: 'hizb',  label: 'الأحزاب' },
    { id: 'juz',   label: 'الأجزاء' },
  ];

  const filteredSurahs = useMemo(() =>
    navIndex.surahs.filter(s =>
      s.sura_name_ar.includes(search) ||
      String(s.sura_no).includes(search)
    ), [search]);

  const filteredHizbs = useMemo(() =>
    navIndex.hizbs.filter(h => String(h.hizb_number).includes(search)),
    [search]);

  const filteredJuzs = useMemo(() =>
    navIndex.juzs.filter(j => String(j.juz_number).includes(search)),
    [search]);

  console.log('NavigationPanel visible:', visible, 'tab:', tab);
  console.log('filteredSurahs:', filteredSurahs?.length);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.panelBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.panelContainer}>
        <View style={styles.panelHandle} />
        <Text style={styles.panelTitle}>البحث في القرآن الكريم</Text>

        {/* Tabs */}
        <View style={styles.panelTabs}>
          {tabs.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.panelTab, tab === t.id && styles.panelTabActive]}
              onPress={() => { setTab(t.id); setSearch(''); }}
            >
              <Text style={[styles.panelTabText, tab === t.id && styles.panelTabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={`البحث في ${tabs.find(t => t.id === tab)?.label}`}
            placeholderTextColor={C.textMuted}
            textAlign="right"
          />
        </View>

        {/* Listes */}
        <View style={styles.panelContent}>

          {/* Sourates */}
          {tab === 'surah' && (
            <FlatList
              data={filteredSurahs}
              keyExtractor={item => String(item.sura_no)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.surahItem, item.first_page === currentPage && styles.surahItemActive]}
                  onPress={() => { onGoTo(item.first_page); onClose(); }}
                >
                  <View style={styles.surahItemLeft}>
                    <Text style={styles.surahItemNum}>{item.sura_no}</Text>
                  </View>
                  <View style={styles.surahItemCenter}>
                    <Text style={styles.surahItemName}>{item.sura_name_ar}</Text>
                    <Text style={styles.surahItemMeta}>
                      {item.type === 'meccan' ? 'مكية' : 'مدنية'} • الصفحة {item.first_page}
                    </Text>
                  </View>
                  {item.first_page === currentPage && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              )}
            />
          )}

          {/* Hizbs */}
          {tab === 'hizb' && (
            <FlatList
              data={filteredHizbs}
              keyExtractor={item => String(item.hizb_number)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.hizbJuzItem, item.first_page === currentPage && styles.hizbJuzItemActive]}
                  onPress={() => { onGoTo(item.first_page); onClose(); }}
                >
                  <Text style={styles.hizbJuzNum}>الحزب {item.hizb_number}</Text>
                  <Text style={styles.hizbJuzVerse} numberOfLines={1}>
                    ﴾{rawData ? getFirstVerseOfHizb(item.hizb_number, rawData) : ''}﴿
                  </Text>
                  {item.first_page === currentPage && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              )}
            />
          )}

          {/* Juz */}
          {tab === 'juz' && (
            <FlatList
              data={filteredJuzs}
              keyExtractor={item => String(item.juz_number)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.hizbJuzItem, item.first_page === currentPage && styles.hizbJuzItemActive]}
                  onPress={() => { onGoTo(item.first_page); onClose(); }}
                >
                  <Text style={styles.hizbJuzNum}>الجزء {item.juz_number}</Text>
                  <Text style={styles.hizbJuzVerse} numberOfLines={1}>
                    ﴾{rawData ? getFirstVerseOfJuz(item.juz_number, rawData) : ''}﴿
                  </Text>
                  {item.first_page === currentPage && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

// ── Panneau Signets ──
const BookmarksPanel = ({ visible, bookmarks, onGoTo, onDelete, onClose }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    bookmarks.filter(p => String(p).includes(search)),
    [bookmarks, search]
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.panelBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.panelContainer}>
        <View style={styles.panelHandle} />
        <Text style={styles.panelTitle}>العلامات المرجعية</Text>

        {/* Tabs factices comme la capture */}
        <View style={styles.panelTabs}>
          <View style={[styles.panelTab, styles.panelTabActive]}>
            <Text style={[styles.panelTabText, styles.panelTabTextActive]}>الصفحات</Text>
          </View>
        </View>

        {/* Recherche */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="البحث في الصفحات"
            placeholderTextColor={C.textMuted}
            keyboardType="number-pad"
            textAlign="right"
          />
        </View>

        <View style={styles.panelContent}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBookmarks}>
              <Text style={styles.emptyBookmarksText}>لا توجد علامات مرجعية</Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={item => String(item)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: page }) => (
                <TouchableOpacity
                  style={styles.bookmarkItem}
                  onPress={() => { onGoTo(page); onClose(); }}
                >
                  <TouchableOpacity
                    style={styles.bookmarkDeleteBtn}
                    onPress={() => onDelete(page)}
                  >
                    <Text style={styles.bookmarkDeleteIcon}>✕</Text>
                  </TouchableOpacity>
                  <View style={styles.bookmarkItemInfo}>
                    <Text style={styles.bookmarkItemPage}>الصفحة {page}</Text>
                    <Text style={styles.bookmarkItemSurah}>{getSurahName(page)}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

// ── Écran principal ──
const QuranReadingScreen = ({ navigation }) => {
  const { rawData: qaloonData, rawData } = useQuran();
  const [fontsLoaded] = useFonts({ ScheherazadeNew_400Regular });

  const flatListRef                     = useRef(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const [navVisible, setNavVisible]     = useState(false);
  const [uiVisible, setUiVisible]       = useState(false);
  const [bookmarksVisible, setBookmarksVisible] = useState(false);
  const fadeAnim                        = useRef(new Animated.Value(0)).current;
  const [bookmarks, setBookmarks]       = useState([]);
  const [toastMsg, setToastMsg]         = useState('');
  const toastAnim                       = useRef(new Animated.Value(0)).current;

  // ── Charger les signets au démarrage ──
  useEffect(() => {
    AsyncStorage.getItem(BOOKMARKS_KEY).then(val => {
      if (val) {
        const saved = JSON.parse(val);
        setBookmarks(saved);
        if (saved.length > 0) {
          const page = saved[saved.length - 1];
          setCurrentPage(page);
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: page - 1, animated: false });
          }, 500);
        }
      }
    });
  }, []);

  // ── Toast ──
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [toastAnim]);

  // ── Toggle signet ──
  const handleToggleBookmark = useCallback(() => {
    let newBookmarks;
    if (bookmarks.includes(currentPage)) {
      newBookmarks = bookmarks.filter(p => p !== currentPage);
      showToast('تم حذف العلامة المرجعية 🗑️');
    } else {
      newBookmarks = [...bookmarks, currentPage];
      showToast(`تم حفظ الصفحة ${currentPage} ✓`);
    }
    setBookmarks(newBookmarks);
    AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  }, [currentPage, bookmarks, showToast]);

  // ── Supprimer un signet depuis le panneau ──
  const handleDeleteBookmark = useCallback((page) => {
    const newBookmarks = bookmarks.filter(p => p !== page);
    setBookmarks(newBookmarks);
    AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  }, [bookmarks]);

  // ── Toggle UI ──
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

  const surahName = useMemo(() => {
    const surahs = navIndex.surahs.filter(s => s.first_page === currentPage);
    if (surahs.length > 0) {
      return surahs.map(s => s.sura_name_ar).join(' • ');
    }
    return navIndex.surahs.filter(s => s.first_page <= currentPage).pop()?.sura_name_ar || '';
  }, [currentPage]);
  const juzNum = useMemo(() =>
    navIndex.juzs.filter(j => j.first_page <= currentPage).pop()?.juz_number || '',
    [currentPage]
  );
  const hizbNum = useMemo(() =>
    navIndex.hizbs.filter(h => h.first_page <= currentPage).pop()?.hizb_number || '',
    [currentPage]
  );

  const isCurrentPageBookmarked = bookmarks.includes(currentPage);

  const goToPage = useCallback((pageNum) => {
    flatListRef.current?.scrollToIndex({ index: pageNum - 1, animated: false });
    setCurrentPage(pageNum);
    setNavVisible(false);
    setBookmarksVisible(false);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].item);
    }
  });

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const renderPage = useCallback(({ item: pageNum }) => (
    <MushafPage
      pageNum={pageNum}
      onTap={toggleUI}
      bookmarks={bookmarks}
      fontsLoaded={fontsLoaded}
    />
  ), [toggleUI, bookmarks, fontsLoaded]);

  const keyExtractor  = useCallback((item) => String(item), []);
  const getItemLayout = useCallback((_, index) => ({
    length: SCREEN_W, offset: SCREEN_W * index, index,
  }), []);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" hidden={!uiVisible} />

      {/* Pages plein écran */}
      <FlatList
        ref={flatListRef}
        data={pages}
        inverted={true}
        renderItem={renderPage}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        initialScrollIndex={0}
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

              {/* ← Retour */}
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              {/* Zone centrale cliquable → Navigation */}
              <TouchableOpacity
                style={styles.headerCenter}
                onPress={() => setNavVisible(true)}
              >
                <Text style={styles.headerSurah} numberOfLines={1}>{surahName}</Text>
                <View style={styles.headerMetaRow}>
                  <Text style={styles.headerMetaText}>الصفحة {currentPage}</Text>
                  <Text style={styles.headerMetaSep}>•</Text>
                  <Text style={styles.headerMetaText}>الجزء {juzNum}</Text>
                </View>
              </TouchableOpacity>

              {/* Signet (vide ou plein) */}
              <TouchableOpacity style={styles.bookmarkBtn} onPress={handleToggleBookmark}>
                <Image
                  source={isCurrentPageBookmarked
                    ? require('../../assets/bookmark_filled.png')
                    : require('../../assets/bookmark_empty.png')}
                  style={styles.bookmarkBtnIcon}
                />
              </TouchableOpacity>

              {/* ☰ → Panneau signets */}
              <TouchableOpacity style={styles.navButton} onPress={() => setBookmarksVisible(true)}>
                <Text style={styles.navButtonText}>☰</Text>
              </TouchableOpacity>

            </View>
          </SafeAreaView>
        </Animated.View>
      )}

      {/* Toast */}
      <Animated.View style={[styles.toast, { opacity: toastAnim }]}>
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>

      {/* Panneau Navigation */}
      <NavigationPanel
        visible={navVisible}
        currentPage={currentPage}
        onGoTo={goToPage}
        onClose={() => setNavVisible(false)}
        rawData={rawData}
      />

      {/* Panneau Signets */}
      <BookmarksPanel
        visible={bookmarksVisible}
        bookmarks={bookmarks}
        onGoTo={goToPage}
        onDelete={handleDeleteBookmark}
        onClose={() => setBookmarksVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f0e8' },

  // ── Page ──
  pageContainer: {
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: '#f5f0e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImage: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  pageImageSpecial: {
    marginTop: SCREEN_H * 0.12,
    height: SCREEN_H * 0.88,
  },

  // ── Page non disponible ──
  pendingContainer: {
    flex: 1, justifyContent: 'center',
    alignItems: 'center', gap: 12,
  },
  pendingText:    { fontSize: 18, color: C.textMuted, fontWeight: '600' },
  pendingPageNum: { fontSize: 32, color: C.gold, fontWeight: '700' },

  // ── Infos overlay ──
  surahOverlay: {
    position: 'absolute',
    top: 65,
    left: 35,
  },
  surahOverlayText: {
    fontFamily: FONT_UI,
    fontSize: 19,
    color: C.gold,
  },
  hizbOverlay: {
    position: 'absolute',
    top: 65,
    right: 35,
  },
  hizbOverlayText: {
    fontFamily: FONT_UI,
    fontSize: 20,
    color: colors.border,
  },
  pageNumOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pageNumOverlayText: {
    fontFamily: FONT_UI,
    fontSize: 20,
    color: colors.border,
  },

  // ── Signet ──
  signet:     {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  signetRight: { right: 43 },
  signetLeft:  { left: 43  },
  signetBody: {
    width: 30,
    height: 37,
    backgroundColor: 'rgba(36, 74, 50, 0.31)',
  },
  signetTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(36, 74, 50, 0.31)',
  },

  // ── Marque-page ──
  bookmarkMark: { position: 'absolute', top: 2 },
  bookmarkIcon: { width: 30, height: 38, resizeMode: 'contain' },

  // ── Header overlay ──
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: C.primaryDark,
    borderBottomWidth: 2, borderBottomColor: C.gold + '44',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  backButton:     { padding: 8 },
  backButtonText: { fontSize: 22, color: C.gold, fontWeight: 'bold' },

  // Zone centrale cliquable
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerSurah: {
    fontFamily: FONT_UI,
    fontSize: 20,
    color: C.white,
    lineHeight: 27,
  },
  headerMetaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  headerMetaText: {
    fontFamily: FONT_UI,
    fontSize: 12,
    color: C.gold,
  },
  headerMetaSep: {
    fontSize: 11,
    color: C.gold + '88',
  },

  // Signet dans header
  bookmarkBtn: {
    padding: 8,
  },
  bookmarkBtnIcon: { width: 20, height: 60,},

  navButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: C.gold + '55',
    borderRadius: 4,
  },
  navButtonText: { color: C.gold, fontSize: 16 },

  // ── Toast ──
  toast: {
    position: 'absolute', bottom: 70, left: 30, right: 30,
    backgroundColor: C.primaryDark + 'ee',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20,
    alignItems: 'center', zIndex: 20,
  },
  toastText: { fontFamily: FONT_UI, color: C.white, fontSize: 15, textAlign: 'center' },

  // ── Panneaux communs ──
  panelBackdrop:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  panelContainer: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderTopColor: C.gold,
    height: SCREEN_H * 0.75,
    paddingBottom: 20,
  },
  panelHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.gold + '66',
    alignSelf: 'center', marginVertical: 10,
  },
  panelTitle: {
    fontFamily: FONT_UI,
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  panelTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  panelTab: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  panelTabActive:     { borderBottomColor: C.primary },
  panelTabText:       { fontFamily: FONT_UI, fontSize: 15, color: C.textMuted },
  panelTabTextActive: { color: C.primary, fontWeight: '700' },
  panelContent: { 
    height: SCREEN_H * 0.5, 
    paddingHorizontal: 12 
  },

  // Barre de recherche
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 10,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchIcon:  { fontSize: 14, marginRight: 6 },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: C.text,
    fontFamily: FONT_UI,
  },

  // ── Items Sourates ──
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  surahItemActive: {
    borderColor: C.gold,
    backgroundColor: C.primary + '08',
  },
  surahItemLeft: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: C.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  surahItemNum: {
    fontSize: 13,
    color: C.primary,
    fontWeight: '700',
  },
  surahItemCenter: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahItemName: {
    fontFamily: FONT_UI,
    fontSize: 17,
    color: C.text,
    fontWeight: '700',
  },
  surahItemMeta: {
    fontFamily: FONT_UI,
    fontSize: 12,
    color: C.textMuted,
    marginTop: 2,
  },

  // ── Items Hizb / Juz ──
  hizbJuzItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'flex-end',
  },
  hizbJuzItemActive: {
    borderColor: C.gold,
    backgroundColor: C.primary + '08',
  },
  hizbJuzNum: {
    fontFamily: FONT_UI,
    fontSize: 17,
    color: C.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  hizbJuzVerse: {
    fontFamily: FONT_UI,
    fontSize: 13,
    color: C.textMuted,
    textAlign: 'right',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 4,
    backgroundColor: C.gold,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  // ── Items Signets ──
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  bookmarkDeleteBtn: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  bookmarkDeleteIcon: { fontSize: 12, color: C.textMuted },
  bookmarkItemInfo:   { flex: 1, alignItems: 'flex-end' },
  bookmarkItemPage: {
    fontFamily: FONT_UI,
    fontSize: 16,
    color: C.text,
    fontWeight: '700',
  },
  bookmarkItemSurah: {
    fontFamily: FONT_UI,
    fontSize: 13,
    color: C.textMuted,
    marginTop: 2,
  },
  emptyBookmarks: {
    flex: 1, justifyContent: 'center',
    alignItems: 'center', paddingTop: 40,
  },
  emptyBookmarksText: {
    fontFamily: FONT_UI,
    fontSize: 16,
    color: C.textMuted,
  },
});

export default QuranReadingScreen;