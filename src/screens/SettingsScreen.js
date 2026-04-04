import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Dimensions, Modal,
  ActivityIndicator, Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import colors from '../styles/colors';
import { RIWAYAT, RIWAYAT_LIST } from '../data/riwayat';
import { useQuran } from '../context/QuranContext';
import {
  isRiwayaDownloaded, downloadRiwaya, deleteRiwaya,
  getRiwayaFileSize, getActiveTestRiwaya, setActiveTestRiwaya,
  getActiveMushafRiwaya, setActiveMushafRiwaya,
} from '../utils/riwayaManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const PREVIEW_VERSE = 'وَلَقَدْ يَسَّرْنَا اَ۬لْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٖۖ ١٧';

const FONT_STEPS = [
  { label: 'صغير',     size: 18 },
  { label: 'متوسط',    size: 22 },
  { label: 'كبير',     size: 26 },
  { label: 'كبير جداً', size: 30 },
];

// ── Section wrapper ────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

// ── Row ────────────────────────────────────────────────────────────
const Row = ({ icon, label, value, onPress, last, locked }) => (
  <TouchableOpacity
    style={[styles.row, last && styles.rowLast]}
    onPress={locked ? null : onPress}
    activeOpacity={locked ? 1 : 0.7}
  >
    {/* RTL : label à droite */}
    <View style={styles.rowRightSide}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowLabel, locked && styles.rowLabelLocked]}>{label}</Text>
      {locked && <Text style={styles.lockBadge}>قريباً</Text>}
    </View>
    {/* valeur + flèche à gauche */}
    <View style={styles.rowLeftSide}>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {!locked && <Text style={styles.rowArrow}>‹</Text>}
      {locked && <Text style={styles.rowLock}>🔒</Text>}
    </View>
  </TouchableOpacity>
);

// ── Stat card ──────────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <View style={styles.statCard}>
    <Text style={[styles.statValue, { color: color || colors.primary }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ══════════════════════════════════════════════════════════════════
const SettingsScreen = ({ navigation }) => {
  const { reloadRiwaya } = useQuran();
  const [fontStep, setFontStep] = useState(1);
  const [savedFontStep, setSavedFontStep] = useState(1);
  const currentFont = FONT_STEPS[fontStep];

  // ── Riwaya state ──
  const [activeTestRiwaya,   setActiveTestRiwayaState]   = useState('qaloon');
  const [activeMushafRiwaya, setActiveMushafRiwayaState] = useState('hafs');
  const [downloadedMap, setDownloadedMap] = useState({}); // { id: bool }
  const [fileSizeMap,   setFileSizeMap]   = useState({}); // { id: '12.3' }
  const [modalVisible,  setModalVisible]  = useState(false);
  const [modalMode,     setModalMode]     = useState('test'); // 'test' | 'mushaf'
  const [downloading,   setDownloading]   = useState(null);  // riwayaId en cours
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Charger état initial
  useEffect(() => {
    const init = async () => {
      const savedStep = await AsyncStorage.getItem('verse_font_step');
      if (savedStep !== null) {
        setFontStep(Number(savedStep));
        setSavedFontStep(Number(savedStep));
      }
      const [testR, mushafR] = await Promise.all([
        getActiveTestRiwaya(),
        getActiveMushafRiwaya(),
      ]);
      setActiveTestRiwayaState(testR);
      setActiveMushafRiwayaState(mushafR);
      await refreshDownloadedMap();
    };
    init();
  }, []);

  const refreshDownloadedMap = async () => {
    const map = {};
    const sizeMap = {};
    for (const r of RIWAYAT_LIST) {
      map[r.id] = await isRiwayaDownloaded(r.id);
      if (map[r.id]) sizeMap[r.id] = await getRiwayaFileSize(r.id);
    }
    setDownloadedMap(map);
    setFileSizeMap(sizeMap);
  };

  const openModal = (mode) => {
    setModalMode(mode);
    setModalVisible(true);
  };

  const handleSelect = async (riwayaId) => {
    if (modalMode === 'test') {
      await setActiveTestRiwaya(riwayaId);
      setActiveTestRiwayaState(riwayaId);
    } else {
      await setActiveMushafRiwaya(riwayaId);
      setActiveMushafRiwayaState(riwayaId);
    }
    setModalVisible(false);
    reloadRiwaya();
  };

  const handleDownload = async (riwayaId) => {
    setDownloading(riwayaId);
    setDownloadProgress(0);
    const result = await downloadRiwaya(riwayaId, (p) => setDownloadProgress(p));
    setDownloading(null);
    if (result.success) {
      await refreshDownloadedMap();
    } else {
      Alert.alert('خطأ', 'فشل التحميل، تحقق من اتصالك بالإنترنت');
    }
  };

  const handleDelete = (riwayaId) => {
    const riwaya = RIWAYAT[riwayaId];
    Alert.alert(
      'حذف الرواية',
      `هل تريد حذف ${riwaya.nameAr}؟ ستحتاج لتحميلها مجدداً للاستخدام.`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: async () => {
          // Si la riwaya supprimée est active, revenir au défaut
          if (modalMode === 'test' && activeTestRiwaya === riwayaId) {
            await setActiveTestRiwaya('qaloon');
            setActiveTestRiwayaState('qaloon');
          }
          if (modalMode === 'mushaf' && activeMushafRiwaya === riwayaId) {
            await setActiveMushafRiwaya('hafs');
            setActiveMushafRiwayaState('hafs');
          }
          await deleteRiwaya(riwayaId);
          await refreshDownloadedMap();
        }},
      ]
    );
  };

  // Riwayat disponibles selon le mode
  const getModalRiwayat = () => {
    if (modalMode === 'test') {
      // Tests: qaloon bundlé, hafs/warsh/doori téléchargeables, aucun locked
      return RIWAYAT_LIST.map(r => ({
        ...r,
        locked: false,
        defaultBundled: r.id === 'qaloon',
      }));
    } else {
      // Mushaf: hafs bundlé, qaloon téléchargeable, warsh locked, doori masqué
      return RIWAYAT_LIST
        .filter(r => r.id !== 'doori')
        .map(r => ({
          ...r,
          locked: r.id === 'warsh',
          defaultBundled: r.id === 'hafs',
        }));
    }
  };

  const activeRiwaya = modalMode === 'test' ? activeTestRiwaya : activeMushafRiwaya;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>الإعدادات</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ══ RIWAYA ══ */}
        <Section title="🎙️  الرواية">
          <Row
            icon="📖"
            label="رواية الاختبارات"
            value={RIWAYAT[activeTestRiwaya]?.nameAr}
            onPress={() => openModal('test')}
          />
          <Row
            icon="🕌"
            label="رواية المصحف"
            value={RIWAYAT[activeMushafRiwaya]?.nameAr}
            onPress={() => openModal('mushaf')}
            last
          />
        </Section>

        {/* ══ MODAL RIWAYA ══ */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>

              {/* Handle */}
              <View style={styles.modalHandle} />

              {/* Titre */}
              <Text style={styles.modalTitle}>
                {modalMode === 'test' ? 'رواية الاختبارات' : 'رواية المصحف'}
              </Text>
              <View style={styles.modalDivider} />

              {/* Liste des riwayat */}
              {getModalRiwayat().map((riwaya) => {
                const isActive    = activeRiwaya === riwaya.id;
                const isDownloaded = downloadedMap[riwaya.id];
                const isDownloading = downloading === riwaya.id;
                const fileSize    = fileSizeMap[riwaya.id];
                const canSelect   = riwaya.defaultBundled || isDownloaded;

                return (
                  <View key={riwaya.id} style={[
                    styles.riwayaRow,
                    isActive && styles.riwayaRowActive,
                    riwaya.locked && styles.riwayaRowLocked,
                  ]}>
                    {/* Infos riwaya */}
                    <View style={styles.riwayaInfo}>
                      <View style={styles.riwayaNameRow}>
                        <Text style={[styles.riwayaName, riwaya.locked && styles.riwayaNameLocked]}>
                          {riwaya.nameAr}
                        </Text>
                        {isActive && <View style={styles.activeDot} />}
                        {riwaya.locked && <Text style={styles.lockBadge}>قريباً</Text>}
                      </View>
                      <Text style={styles.riwayaImam}>{riwaya.fullNameAr}</Text>
                      <Text style={styles.riwayaRegion}>{riwaya.region}</Text>
                      {fileSize && (
                        <Text style={styles.riwayaSize}>{fileSize} MB محمّل</Text>
                      )}
                    </View>

                    {/* Action */}
                    {!riwaya.locked && (
                      <View style={styles.riwayaAction}>
                        {isDownloading ? (
                          <View style={styles.progressWrap}>
                            <ActivityIndicator color={colors.primary} size="small" />
                            <Text style={styles.progressText}>
                              {Math.round(downloadProgress * 100)}%
                            </Text>
                          </View>
                        ) : canSelect ? (
                          <View style={styles.riwayaButtons}>
                            <TouchableOpacity
                              style={[styles.selectBtn, isActive && styles.selectBtnActive]}
                              onPress={() => !isActive && handleSelect(riwaya.id)}
                            >
                              <Text style={[styles.selectBtnText, isActive && styles.selectBtnTextActive]}>
                                {isActive ? '✓ مختار' : 'اختر'}
                              </Text>
                            </TouchableOpacity>
                            {!riwaya.defaultBundled && (
                              <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDelete(riwaya.id)}
                              >
                                <Text style={styles.deleteBtnText}>🗑</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.downloadBtn}
                            onPress={() => handleDownload(riwaya.id)}
                          >
                            <Text style={styles.downloadBtnText}>⬇ تحميل</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}

            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* ══ AFFICHAGE ══ */}
        <Section title="🎨  العرض">

          {/* Titre + valeur actuelle */}
          <View style={styles.fontHeader}>
            <View style={styles.rowRightSide}>
              <Text style={styles.rowIcon}>أ</Text>
              <Text style={styles.rowLabel}>حجم الخط</Text>
            </View>
            <Text style={styles.rowValue}>{currentFont.label}</Text>
          </View>

          {/* Slider */}
          <View style={styles.sliderWrap}>
            <Text style={styles.sliderMax}>أ</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={3}
              step={1}
              value={fontStep}
              onValueChange={(v) => setFontStep(Math.round(v))}              
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.borderLight}
              thumbTintColor={colors.secondary}
              inverted
            />
            <Text style={styles.sliderMin}>أ</Text>
          </View>

          {/* Aperçu */}
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>معاينة</Text>
            <Text style={[styles.previewVerse, { fontSize: currentFont.size, lineHeight: currentFont.size * 1.8 }]}>
              {PREVIEW_VERSE}
            </Text>
          </View>

          {fontStep !== savedFontStep && (
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={async () => {
                await AsyncStorage.setItem('verse_font_step', String(fontStep));
                setSavedFontStep(fontStep);
              }}
            >
              <Text style={styles.confirmBtnText}>تأكيد الحجم</Text>
            </TouchableOpacity>
          )}

        </Section>

        {/* ══ STATS ══ */}
        <Section title="📊  إحصائياتي">

          <View style={styles.statsRow}>
            <StatCard label="اختبار مجتاز" value="—" color={colors.success} />
            <StatCard label="اختبار راسب"  value="—" color={colors.error} />
            <StatCard label="إجمالي"        value="—" color={colors.primary} />
          </View>

          <View style={styles.divider} />

          <View style={styles.statsBlock}>
            <Text style={styles.statsBlockTitle}>أكثر السور اختباراً</Text>
            <Text style={styles.statsPlaceholder}>— لا توجد بيانات بعد —</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsBlock}>
            <Text style={styles.statsBlockTitle}>أكثر الأحزاب اختباراً</Text>
            <Text style={styles.statsPlaceholder}>— لا توجد بيانات بعد —</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.statsBlock, { paddingBottom: 16 }]}>
            <Text style={styles.statsBlockTitle}>مراكز التأمل 🔍</Text>
            <Text style={styles.statsSubtitle}>المقاطع ذات النتائج الأضعف</Text>
            <Text style={styles.statsPlaceholder}>— لا توجد بيانات بعد —</Text>
          </View>

        </Section>

      </ScrollView>
    </SafeAreaView>
  );
};

// ══════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: colors.bgLight },

  // ── HEADER ──
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  // En RTL, › pointe vers la droite = retour arrière
  backIcon: { fontSize: 26, color: colors.textLight },
  headerTitle: {
    fontSize: 22, fontWeight: '700',
    color: colors.textLight,
    fontFamily: 'ScheherazadeNew_400Regular',
  },

  // ── SCROLL ──
  scroll: { flex: 1 },
  scrollContent: { paddingVertical: 20, paddingHorizontal: 16, paddingBottom: 40 },

  // ── SECTION ──
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: colors.bgPaper,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // ── ROW ──
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLast: { borderBottomWidth: 0 },
  rowRightSide: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLeftSide:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowIcon: { fontSize: 18, width: 26, textAlign: 'center' },
  rowLabel: {
    fontSize: 16, color: colors.textPrimary,
    fontFamily: 'ScheherazadeNew_400Regular',
  },
  rowLabelLocked: { color: colors.textSecondary },
  rowValue: {
    fontSize: 14, color: colors.secondary,
    fontFamily: 'ScheherazadeNew_400Regular',
    fontWeight: '600',
  },
  rowArrow: { fontSize: 22, color: colors.textSecondary },
  rowLock:  { fontSize: 16 },
  lockBadge: {
    fontSize: 10, color: colors.secondary,
    backgroundColor: 'rgba(212,175,55,0.12)',
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, overflow: 'hidden',
    fontFamily: 'ScheherazadeNew_400Regular',
  },

  // ── FONT SIZE ──
  fontHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sliderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 6,
  },
  sliderMin: { fontSize: 13, color: colors.textSecondary, width: 22, textAlign: 'center' },
  sliderMax: { fontSize: 22, color: colors.textSecondary, width: 28, textAlign: 'center' },
  slider: { flex: 1, height: 40 },

  previewBox: {
    margin: 12,
    marginTop: 4,
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    padding: 14,
  },
  previewLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'ScheherazadeNew_400Regular',
    marginBottom: 8,
    textAlign: 'right',
  },
  previewVerse: {
    color: colors.textPrimary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  // ── STATS ──
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statCard: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: {
    fontSize: 11, color: colors.textSecondary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'center',
  },
  divider: { height: 1, backgroundColor: colors.borderLight, marginHorizontal: 16 },
  statsBlock: { paddingHorizontal: 16, paddingTop: 14 },
  statsBlockTitle: {
    fontSize: 15, fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'right',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 12, color: colors.textSecondary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'right',
    marginBottom: 8,
  },
  statsPlaceholder: {
    fontSize: 13, color: colors.textSecondary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'center',
    paddingVertical: 12,
    fontStyle: 'italic',
  },

  // ── CONFIRM BTN ──
  confirmBtn: {
    margin: 12, marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: colors.textLight,
    fontSize: 15, fontWeight: '700',
    fontFamily: 'ScheherazadeNew_400Regular',
  },

  // ── MODAL RIWAYA ──
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.bgPaper,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12,  minHeight: '40%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.borderLight,
    alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18, fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'center', marginBottom: 12,
  },
  modalDivider: { height: 1, backgroundColor: colors.borderLight, marginBottom: 12 },

  riwayaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 14, marginBottom: 8,
    backgroundColor: colors.bgWhite,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  riwayaRowActive: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  riwayaRowLocked: { opacity: 0.5 },
  riwayaInfo: { flex: 1, alignItems: 'flex-end' },
  riwayaNameRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2,
  },
  riwayaName: {
    fontSize: 17, fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'ScheherazadeNew_400Regular',
  },
  riwayaNameLocked: { color: colors.textSecondary },
  activeDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  lockBadge: {
    fontSize: 10, color: colors.secondary,
    backgroundColor: 'rgba(212,175,55,0.12)',
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, overflow: 'hidden',
    fontFamily: 'ScheherazadeNew_400Regular',
  },
  riwayaImam: {
    fontSize: 12, color: colors.textSecondary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'right',
  },
  riwayaRegion: {
    fontSize: 11, color: colors.textSecondary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'right', marginTop: 1,
  },
  riwayaSize: {
    fontSize: 10, color: colors.primary,
    fontFamily: 'ScheherazadeNew_400Regular',
    textAlign: 'right', marginTop: 3,
  },
  riwayaAction: { marginRight: 10 },
  riwayaButtons: { alignItems: 'center', gap: 6 },
  selectBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 10, borderWidth: 1.5,
    borderColor: colors.primary,
  },
  selectBtnActive: {
    backgroundColor: colors.primary, borderColor: colors.primary,
  },
  selectBtnText: {
    fontSize: 13, color: colors.primary, fontWeight: '600',
    fontFamily: 'ScheherazadeNew_400Regular',
  },
  selectBtnTextActive: { color: colors.textLight },
  deleteBtn: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, borderWidth: 1,
    borderColor: colors.error,
  },
  deleteBtnText: { fontSize: 13 },
  downloadBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  downloadBtnText: {
    fontSize: 13, color: colors.textLight, fontWeight: '600',
    fontFamily: 'ScheherazadeNew_400Regular',
  },
  progressWrap: { alignItems: 'center', gap: 4 },
  progressText: {
    fontSize: 12, color: colors.primary, fontWeight: '700',
  },

});

export default SettingsScreen;