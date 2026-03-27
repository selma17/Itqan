import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import colors from '../styles/colors';
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
  const [fontStep, setFontStep] = useState(1);
  const currentFont = FONT_STEPS[fontStep];

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
          <Row icon="📖" label="رواية الاختبارات" value="قالون" onPress={() => {}} />
          <Row icon="🕌" label="رواية المصحف"     value="قالون" onPress={() => {}} last />
        </Section>

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
    flexDirection: 'row',
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
    flexDirection: 'row',
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

});

export default SettingsScreen;