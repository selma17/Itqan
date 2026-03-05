import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

import {
  QURAN_PAGES,
  SURAH_INDEX,
  JUZ_INDEX,
  BISMILLAH,
} from '../data/quranPages';

import colors from '../styles/colors';

// ─────────────────────────────────────────────────────────────────────────────
// POLICES
// ─────────────────────────────────────────────────────────────────────────────
const FONT_QURAN = 'QaloonQuran';
const FONT_UI    = 'ScheherazadeNew';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Palette du projet (colors.js)
const C = {
  bg:          colors.bgLight,       // '#f8f6f0'
  bgPage:      colors.bgPaper,       // '#fffef9'
  primary:     colors.primary,       // '#2d5a3e' vert
  primaryDark: colors.primaryDark,   // '#1e3d2a'
  gold:        colors.secondary,     // '#d4af37' or
  text:        colors.textPrimary,   // '#1a2b1f'
  textMuted:   colors.textSecondary, // '#4a5f54'
  border:      colors.border,        // '#d4c4a8'
  borderLight: colors.borderLight,   // '#e8e4d8'
  white:       colors.textLight,     // '#ffffff'
  ayahEnd:     '#77554B',            // couleur Flutter exacte pour fin d'ayah
};

const FONT_SIZE_AYAH     = 22;
const FONT_SIZE_AYAH_NUM = 25;   // +3 comme Flutter
const LINE_HEIGHT_RATIO  = 2;

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT : Numéro d'ayah
// FIX : un seul \u06DD (cercle décoratif) + le chiffre arabe
// Le bug "deux cercles" venait du \u06DD + le chiffre arabe qui contient
// lui-même un ornement dans certaines polices — on affiche juste le chiffre
// ─────────────────────────────────────────────────────────────────────────────
const AyahNumber = ({ num }) => (
  <Text style={styles.ayahNumber}> {num} </Text>
);

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT : Segment d'ayah
// Logique Flutter : corps normal + dernière lettre en couleur ayahEnd
// ─────────────────────────────────────────────────────────────────────────────
const AyahSegment = ({ seg }) => {
  const { text, is_end, aya_num } = seg;
  if (!text) return null;

  if (is_end && text.length > 0) {
    const body     = text.slice(0, -1);
    const lastChar = text.slice(-1);
    return (
      <Text>
        <Text style={styles.ayahText}>{body}</Text>
        <Text style={styles.ayahTextEnd}>{lastChar}</Text>
        {aya_num ? <AyahNumber num={aya_num} /> : null}
      </Text>
    );
  }

  return <Text style={styles.ayahText}>{text}</Text>;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT : Ligne coranique
// ─────────────────────────────────────────────────────────────────────────────
const QuranLine = ({ line }) => (
  <Text style={styles.quranLine}>
    {line.segments.map((seg, i) => (
      <Text key={`${seg.aya_no}-${i}`}>
        {i > 0 ? ' ' : ''}
        <AyahSegment seg={seg} />
      </Text>
    ))}
  </Text>
);

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT : En-tête de sourate
// ─────────────────────────────────────────────────────────────────────────────
const SurahHeader = ({ sura, hasBismillah }) => (
  <View style={styles.surahHeaderContainer}>
    <View style={styles.surahBanner}>
      <View style={styles.bannerOrnamentLeft}>
        <Text style={styles.bannerOrnamentText}>❖</Text>
      </View>
      <View style={styles.bannerOrnamentRight}>
        <Text style={styles.bannerOrnamentText}>❖</Text>
      </View>
      <Text style={styles.surahName}>سُورَةُ {sura.name_ar}</Text>
    </View>
    {hasBismillah && (
      <Text style={styles.bismillah}>{BISMILLAH}</Text>
    )}
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT : Page du Mushaf
// FIX responsive : flex:1 sur pageContainer + pageInner, pas de hauteur fixe
// ─────────────────────────────────────────────────────────────────────────────
const MushafPage = React.memo(({ data }) => {
  const hasHeader  = data.starting_suras.length > 0;
  const isShortPage = data.lines.length < 10;

  return (
    <View style={styles.pageContainer}>
      {/* Bordures décoratives */}
      <View style={[styles.pageBorder, styles.pageBorderLeft]} />
      <View style={[styles.pageBorder, styles.pageBorderRight]} />

      <View style={styles.pageInner}>
        {hasHeader && (
          <SurahHeader
            sura={data.starting_suras[0]}
            hasBismillah={data.has_bismillah}
          />
        )}

        <View style={[
          styles.linesContainer,
          isShortPage && styles.linesContainerCentered,
        ]}>
          {data.lines.map(line => (
            <QuranLine key={line.line} line={line} />
          ))}
        </View>

        {/* Numéro de page */}
        <Text style={styles.pageNumber}>{data.page}</Text>
      </View>
    </View>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT : Drawer de navigation
// ─────────────────────────────────────────────────────────────────────────────
const NavDrawer = ({ visible, currentPage, onGoTo, onClose }) => {
  const [tab, setTab]           = useState('surah');
  const [jumpValue, setJumpValue] = useState('');

  const surahList = useMemo(() =>
    Object.entries(SURAH_INDEX)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([no, info]) => ({ no: parseInt(no), ...info })),
    []
  );

  const juzList = useMemo(() =>
    Object.entries(JUZ_INDEX)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([juz, page]) => ({ juz: parseInt(juz), page })),
    []
  );

  const handleJump = () => {
    const n = parseInt(jumpValue);
    if (n >= 1 && n <= 604) { onGoTo(n); onClose(); }
  };

  const tabs = [
    { id: 'surah', label: 'سورة' },
    { id: 'juz',   label: 'جزء'  },
    { id: 'page',  label: 'صفحة' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.drawerBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.drawerContainer}>
        <View style={styles.drawerHandle} />

        {/* Tabs */}
        <View style={styles.drawerTabs}>
          {tabs.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.drawerTab, tab === t.id && styles.drawerTabActive]}
              onPress={() => setTab(t.id)}
            >
              <Text style={[
                styles.drawerTabText,
                tab === t.id && styles.drawerTabTextActive,
              ]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.drawerContent}>
          {tab === 'surah' && (
            <FlatList
              data={surahList}
              keyExtractor={item => String(item.no)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.drawerItem,
                    item.page === currentPage && styles.drawerItemActive,
                  ]}
                  onPress={() => { onGoTo(item.page); onClose(); }}
                >
                  <Text style={styles.drawerItemNum}>{item.no}</Text>
                  <Text style={[styles.drawerItemText, { fontFamily: FONT_UI }]}>
                    سورة {item.name_ar}
                  </Text>
                  <Text style={styles.drawerItemPage}>ص {item.page}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {tab === 'juz' && (
            <FlatList
              data={juzList}
              numColumns={5}
              keyExtractor={item => String(item.juz)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.juzItem,
                    item.page === currentPage && styles.juzItemActive,
                  ]}
                  onPress={() => { onGoTo(item.page); onClose(); }}
                >
                  <Text style={[
                    styles.juzItemText,
                    item.page === currentPage && styles.juzItemTextActive,
                  ]}>
                    {item.juz}
                  </Text>
                  <Text style={styles.juzLabel}>جزء</Text>
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
              <TouchableOpacity
                style={styles.pageJumpBtn}
                onPress={handleJump}
              >
                <Text style={styles.pageJumpBtnText}>انتقل</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ÉCRAN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
const QuranReadingScreen = ({ navigation }) => {

  // ── Hooks — TOUS avant tout return conditionnel ───────────────────────────
  const [fontsLoaded] = useFonts({
    [FONT_QURAN]: require('../../assets/fonts/qaloon.10.ttf'),
    // [FONT_UI]: ScheherazadeNew_400Regular,
  });

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [navVisible, setNavVisible]     = useState(false);

  const currentSurahName = useMemo(() => {
    for (let i = currentIndex; i >= 0; i--) {
      if (QURAN_PAGES[i].starting_suras.length > 0) {
        return QURAN_PAGES[i].starting_suras[0].name_ar;
      }
    }
    return '';
  }, [currentIndex]);

  const goToPage = useCallback((pageNum) => {
    const idx = QURAN_PAGES.findIndex(p => p.page === pageNum);
    if (idx !== -1) {
      // FIX scroll inversé : avec inverted=true les index sont miroir
      flatListRef.current?.scrollToIndex({ index: idx, animated: false });
      setCurrentIndex(idx);
    }
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      // FIX scroll inversé : avec inverted=true l'index affiché = length-1-index
      const idx = viewableItems[0].index;
      setCurrentIndex(QURAN_PAGES.length - 1 - idx);
    }
  });

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const renderPage = useCallback(({ item }) => (
    <MushafPage data={item} />
  ), []);

  const keyExtractor = useCallback((item) => String(item.page), []);

  const getItemLayout = useCallback((_, index) => ({
    length: SCREEN_W,
    offset: SCREEN_W * index,
    index,
  }), []);

  // ── Return conditionnel APRÈS tous les hooks ──────────────────────────────
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={C.gold} />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  const currentPage = QURAN_PAGES[currentIndex];

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.primaryDark} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerMeta}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>جزء {currentPage.juz}</Text>
          </View>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>حزب {currentPage.hizb}</Text>
          </View>
        </View>

        <Text style={styles.headerSurah} numberOfLines={1}>
          {currentSurahName}
        </Text>

        <TouchableOpacity style={styles.navButton} onPress={() => setNavVisible(true)}>
          <Text style={styles.navButtonText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* ── PAGES — scroll RTL inversé ── */}
      {/*
        FIX direction scroll :
        - inverted={true} retourne la FlatList → le scroll va de droite à gauche
        - Les données sont dans l'ordre normal, inverted gère le miroir
        - initialScrollIndex pointe sur le dernier item (qui devient le 1er affiché)
      */}
      <FlatList
        ref={flatListRef}
        data={QURAN_PAGES}
        renderItem={renderPage}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        inverted={true}                  // ← FIX : scroll droite→gauche (RTL)
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        initialScrollIndex={QURAN_PAGES.length - 1}   // commence à la page 1 (fin du tableau inversé)
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        style={styles.flatList}
      />

      {/* ── FOOTER — juste le numéro de page, pas de boutons ── */}
      {/* FIX : supprimé les boutons suivante/précédente, le scroll suffit */}
      <View style={styles.footer}>
        <Text style={styles.footerPageNum}>
          {currentPage.page} / 604
        </Text>
      </View>

      {/* ── DRAWER ── */}
      <NavDrawer
        visible={navVisible}
        currentPage={currentPage.page}
        onGoTo={goToPage}
        onClose={() => setNavVisible(false)}
      />
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Loading ──
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.primaryDark,
    gap: 16,
  },
  loadingText: {
    color: C.gold,
    fontSize: 16,
  },

  // ── Écran ──
  screen: {
    flex: 1,
    backgroundColor: C.primaryDark,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: C.primary,
    borderBottomWidth: 1,
    borderBottomColor: C.gold + '55',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 22,
    color: C.gold,
    fontWeight: 'bold',
  },
  headerMeta: {
    flexDirection: 'row',
    gap: 4,
  },
  metaBadge: {
    backgroundColor: C.gold + '25',
    borderWidth: 1,
    borderColor: C.gold + '66',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metaBadgeText: {
    color: C.gold,
    fontSize: 11,
    fontFamily: FONT_UI,
  },
  headerSurah: {
    flex: 1,
    color: C.white,
    fontSize: 16,
    fontFamily: FONT_UI,
    textAlign: 'center',
    marginHorizontal: 6,
  },
  navButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: C.gold + '55',
    borderRadius: 4,
  },
  navButtonText: {
    color: C.gold,
    fontSize: 16,
  },

  // ── FlatList ──
  // FIX responsive : flex:1 pour occuper tout l'espace entre header et footer
  flatList: {
    flex: 1,
  },

  // ── Page ──
  // FIX responsive : width = SCREEN_W, pas de hauteur fixe
  pageContainer: {
    width: SCREEN_W,
    flex: 1,                       // ← s'étire pour remplir la hauteur disponible
    backgroundColor: C.bgPage,
    position: 'relative',
  },
  pageBorder: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: C.gold + '40',
  },
  pageBorderLeft:  { left: 6 },
  pageBorderRight: { right: 6 },
  pageInner: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 6,
    justifyContent: 'space-between',
  },

  // ── En-tête sourate ──
  surahHeaderContainer: {
    marginBottom: 4,
  },
  surahBanner: {
    backgroundColor: C.primary,
    borderWidth: 1,
    borderColor: C.gold,
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerOrnamentLeft: {
    position: 'absolute',
    left: 8,
    top: 0, bottom: 0,
    justifyContent: 'center',
  },
  bannerOrnamentRight: {
    position: 'absolute',
    right: 8,
    top: 0, bottom: 0,
    justifyContent: 'center',
  },
  bannerOrnamentText: {
    color: C.gold,
    fontSize: 13,
  },
  surahName: {
    fontFamily: FONT_UI,
    fontSize: 17,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  bismillah: {
    fontFamily: FONT_QURAN,
    fontSize: 21,
    color: C.text,
    textAlign: 'center',
    lineHeight: 21 * LINE_HEIGHT_RATIO,
    marginTop: 4,
    writingDirection: 'rtl',
  },

  // ── Lignes coraniques ──
  linesContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  linesContainerCentered: {
    justifyContent: 'center',
    gap: 2,
  },

  // ── Texte coranique — logique Flutter exacte ──
  quranLine: {
    textAlign: 'center',
    fontFamily: FONT_QURAN,
    fontSize: FONT_SIZE_AYAH,
    lineHeight: FONT_SIZE_AYAH * LINE_HEIGHT_RATIO,
    writingDirection: 'rtl',
    color: C.text,
    letterSpacing: 0,
  },
  ayahText: {
    fontFamily: FONT_QURAN,
    fontSize: FONT_SIZE_AYAH,
    lineHeight: FONT_SIZE_AYAH * LINE_HEIGHT_RATIO,
    color: C.text,
    letterSpacing: 0,
  },
  ayahTextEnd: {
    fontFamily: FONT_QURAN,
    fontSize: FONT_SIZE_AYAH,
    lineHeight: FONT_SIZE_AYAH * LINE_HEIGHT_RATIO,
    color: C.ayahEnd,              // #77554B — dernière lettre
    letterSpacing: 0,
  },
  // FIX double cercle : on n'utilise plus \u06DD, juste le chiffre entre espaces
  ayahNumber: {
    fontFamily: FONT_QURAN,
    fontSize: FONT_SIZE_AYAH_NUM,  // +3 comme Flutter
    lineHeight: FONT_SIZE_AYAH_NUM * LINE_HEIGHT_RATIO,
    color: C.ayahEnd,
    letterSpacing: 0,
  },

  // ── Numéro de page ──
  pageNumber: {
    textAlign: 'center',
    color: C.textMuted,
    fontFamily: FONT_UI,
    fontSize: 13,
    marginTop: 2,
    letterSpacing: 2,
  },

  // ── Footer — simplifié : juste le numéro de page ──
  footer: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: C.primaryDark,
    borderTopWidth: 1,
    borderTopColor: C.gold + '33',
  },
  footerPageNum: {
    color: C.gold,
    fontFamily: FONT_UI,
    fontSize: 13,
    letterSpacing: 2,
  },

  // ── Drawer ──
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  drawerContainer: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 2,
    borderTopColor: C.gold,
    maxHeight: SCREEN_H * 0.65,
    paddingBottom: 20,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.gold + '66',
    alignSelf: 'center',
    marginVertical: 10,
  },
  drawerTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    paddingHorizontal: 16,
  },
  drawerTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  drawerTabActive: {
    borderBottomColor: C.primary,
  },
  drawerTabText: {
    fontFamily: FONT_UI,
    fontSize: 16,
    color: C.textMuted,
  },
  drawerTabTextActive: {
    color: C.primary,
    fontWeight: '700',
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: C.borderLight,
    backgroundColor: C.bg,
  },
  drawerItemActive: {
    backgroundColor: C.primary + '15',
    borderColor: C.primary,
  },
  drawerItemNum: {
    fontSize: 12,
    color: C.textMuted,
    width: 24,
    textAlign: 'center',
  },
  drawerItemText: {
    flex: 1,
    fontSize: 16,
    color: C.text,
    textAlign: 'right',
    marginRight: 8,
  },
  drawerItemPage: {
    fontSize: 11,
    color: C.textMuted,
  },
  juzItem: {
    flex: 1,
    margin: 3,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.borderLight,
    backgroundColor: C.bg,
    alignItems: 'center',
  },
  juzItemActive: {
    backgroundColor: C.primary + '15',
    borderColor: C.primary,
  },
  juzItemText: {
    fontFamily: FONT_UI,
    fontSize: 17,
    color: C.text,
  },
  juzItemTextActive: {
    color: C.primary,
    fontWeight: '700',
  },
  juzLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
  pageJumpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  pageJumpLabel: {
    fontFamily: FONT_UI,
    fontSize: 15,
    color: C.textMuted,
  },
  pageJumpInput: {
    width: 72,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.gold,
    backgroundColor: C.white,
    fontFamily: FONT_UI,
    fontSize: 16,
    color: C.text,
  },
  pageJumpBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: C.primary,
  },
  pageJumpBtnText: {
    fontFamily: FONT_UI,
    fontSize: 15,
    color: C.white,
  },
});

export default QuranReadingScreen;