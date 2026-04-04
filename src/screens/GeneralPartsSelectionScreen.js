import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, Alert, TextInput, ToastAndroid, Platform,
} from 'react-native';
import colors from '../styles/colors';
import { useQuran } from '../context/QuranContext';

// Définition des parties et leurs plages de hizbs (hizbs 1-60)
const PARTS = {
  quarters: [
    { id: 1, label: 'الربع الأول',   hizbFrom: 1,  hizbTo: 15 },
    { id: 2, label: 'الربع الثاني',  hizbFrom: 16, hizbTo: 30 },
    { id: 3, label: 'الربع الثالث',  hizbFrom: 31, hizbTo: 45 },
    { id: 4, label: 'الربع الأخير',  hizbFrom: 46, hizbTo: 60 },
  ],
  halves: [
    { id: 1, label: 'النصف الأول',  hizbFrom: 1,  hizbTo: 30 },
    { id: 2, label: 'النصف الثاني', hizbFrom: 31, hizbTo: 60 },
  ],
  thirds: [
    { id: 1, label: 'الثلث الأول',  hizbFrom: 1,  hizbTo: 20 },
    { id: 2, label: 'الثلث الثاني', hizbFrom: 21, hizbTo: 40 },
    { id: 3, label: 'الثلث الأخير', hizbFrom: 41, hizbTo: 60 },
  ],
  sixths: [
    { id: 1, label: 'السدس الأول',  hizbFrom: 1,  hizbTo: 10 },
    { id: 2, label: 'السدس الثاني', hizbFrom: 11, hizbTo: 20 },
    { id: 3, label: 'السدس الثالث', hizbFrom: 21, hizbTo: 30 },
    { id: 4, label: 'السدس الرابع', hizbFrom: 31, hizbTo: 40 },
    { id: 5, label: 'السدس الخامس', hizbFrom: 41, hizbTo: 50 },
    { id: 6, label: 'السدس الأخير', hizbFrom: 51, hizbTo: 60 },
  ],
};

const CATEGORY_LABELS = {
  quarters: 'الأرباع',
  halves:   'الأنصاف',
  thirds:   'الأثلاث',
  sixths:   'الأسداس',
};

const getPartInfo = (part) => {
  try {
    if (!Array.isArray(quranData)) return null;

    const partVerses = quranData.filter(
      item => item.hizb !== undefined && item.hizb >= part.hizbFrom && item.hizb <= part.hizbTo
    );

    if (partVerses.length === 0) return null;

    const pages = partVerses.map(v => parseInt(v.page)).filter(p => !isNaN(p));
    const startPage = Math.min(...pages);
    const endPage   = Math.max(...pages);

    const surahsMap = new Map();
    partVerses.forEach(v => {
      if (v.sura_no && v.sura_name_ar) {
        surahsMap.set(v.sura_no, { number: v.sura_no, name: v.sura_name_ar });
      }
    });
    const surahs = Array.from(surahsMap.values()).sort((a, b) => a.number - b.number);

    return {
      startPage,
      endPage,
      totalPages: endPage - startPage + 1,
      totalVerses: partVerses.length,
      surahs,
    };
  } catch (e) {
    return null;
  }
};

const GeneralPartsSelectionScreen = ({ navigation }) => {
  const { rawData: quranData } = useQuran();
  const [selectedCategory, setSelectedCategory] = useState('quarters');
  const [selectedPart, setSelectedPart]         = useState(null);
  const [partInfo, setPartInfo]                 = useState(null);
  const [mode, setMode]                         = useState('random');
  const [questionCount, setQuestionCount]       = useState('');
  const [showSurahName, setShowSurahName]       = useState(true);

  useEffect(() => {
    setSelectedPart(null);
    setPartInfo(null);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedPart) {
      setPartInfo(getPartInfo(selectedPart));
    } else {
      setPartInfo(null);
    }
  }, [selectedPart]);

  const handleStartTest = () => {
    if (!selectedPart) {
      Alert.alert('تنبيه', 'الرجاء اختيار جزء من القرآن');
      return;
    }
    if (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0)) {
      Alert.alert('تنبيه', 'يجب تحديد عدد الأسئلة عند اختيار الوضع المتسلسل');
      return;
    }
    navigation.navigate('Duaa', {
      testType:     'GeneralPart',
      partLabel:    selectedPart.label,
      hizbFrom:     selectedPart.hizbFrom,
      hizbTo:       selectedPart.hizbTo,
      selectionMode: mode,
      questionCount: questionCount ? parseInt(questionCount) : null,
      showSurahName,
    });
  };

  const isButtonDisabled =
    !selectedPart ||
    (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0));

  const currentParts = PARTS[selectedCategory];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>اختبار حسب الأجزاء</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>

        <View style={styles.content}>

          {/* Sélection de la catégorie */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>نوع التقسيم</Text>
            <View style={styles.categoryRow}>
              {Object.keys(PARTS).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, selectedCategory === cat && styles.categoryButtonActive]}
                  onPress={() => setSelectedCategory(cat)}>
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sélection de la partie */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر الجزء</Text>
            <View style={styles.partsGrid}>
              {currentParts.map(part => (
                <TouchableOpacity
                  key={part.id}
                  style={[
                    styles.partButton,
                    selectedPart?.id === part.id && selectedPart?.hizbFrom === part.hizbFrom
                      && styles.partButtonActive,
                  ]}
                  onPress={() => setSelectedPart(part)}>
                  <Text style={[
                    styles.partText,
                    selectedPart?.id === part.id && selectedPart?.hizbFrom === part.hizbFrom
                      && styles.partTextActive,
                  ]}>
                    {part.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info sur la partie sélectionnée */}
          {selectedPart && partInfo && (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>{selectedPart.label}</Text>
              <View style={styles.infoDetailsContainer}>
                <View style={styles.infoDetailRow}>
                  <Text style={styles.infoDetailLabel}>الصفحات:</Text>
                  <Text style={styles.infoDetailValue}>
                    {partInfo.startPage} - {partInfo.endPage} ({partInfo.totalPages} صفحة)
                  </Text>
                </View>
                <View style={styles.infoDetailRow}>
                  <Text style={styles.infoDetailLabel}>عدد الآيات:</Text>
                  <Text style={styles.infoDetailValue}>{partInfo.totalVerses} آية</Text>
                </View>
                <View style={styles.infoDetailRow}>
                  <Text style={styles.infoDetailLabel}>السور:</Text>
                  <Text style={styles.infoDetailValue}>
                    {partInfo.surahs.map(s => s.name).join('، ')}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Mode */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ترتيب الأسئلة</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, mode === 'sequential' && styles.radioButtonActive]}
                onPress={() => {
                  setMode('sequential');
                  if (Platform.OS === 'android') ToastAndroid.show('يجب تحديد عدد الأسئلة', ToastAndroid.SHORT);
                }}>
                <Text style={[styles.radioText, mode === 'sequential' && styles.radioTextActive]}>
                  حسب ترتيب المصحف
                </Text>
                <View style={[styles.radio, mode === 'sequential' && styles.radioActive]}>
                  {mode === 'sequential' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.radioButton, mode === 'random' && styles.radioButtonActive]}
                onPress={() => setMode('random')}>
                <Text style={[styles.radioText, mode === 'random' && styles.radioTextActive]}>
                  عشوائي
                </Text>
                <View style={[styles.radio, mode === 'random' && styles.radioActive]}>
                  {mode === 'random' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nombre de questions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>عدد الأسئلة</Text>
            <TextInput
              style={styles.numberInput}
              keyboardType="numeric"
              value={questionCount}
              onChangeText={setQuestionCount}
              placeholder=" -- "
              placeholderTextColor={colors.textSecondary}
              textAlign="center"
            />
          </View>

          {/* Afficher nom sourate */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>عرض اسم السورة التي ورد فيها الموضع</Text>
            <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
              <TouchableOpacity
                style={[styles.radioButton, { flex: 1 }, showSurahName === true && styles.radioButtonActive]}
                onPress={() => setShowSurahName(true)}>
                <Text style={[styles.radioText, showSurahName === true && styles.radioTextActive]}>نعم</Text>
                <View style={[styles.radio, showSurahName === true && styles.radioActive]}>
                  {showSurahName === true && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, { flex: 1 }, showSurahName === false && styles.radioButtonActive]}
                onPress={() => setShowSurahName(false)}>
                <Text style={[styles.radioText, showSurahName === false && styles.radioTextActive]}>لا</Text>
                <View style={[styles.radio, showSurahName === false && styles.radioActive]}>
                  {showSurahName === false && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startButton, isButtonDisabled && styles.startButtonDisabled]}
            onPress={handleStartTest}
            activeOpacity={0.85}
            disabled={isButtonDisabled}>
            <Text style={styles.startButtonText}>
              {isButtonDisabled
                ? (!selectedPart ? 'اختر جزءاً أولاً' : 'حدد عدد الأسئلة أولاً')
                : 'بدء الاختبار'
              }
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 30,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  backButtonText: { fontSize: 25, color: colors.textLight, fontWeight: 'bold', marginBottom: 20 },
  headerContent: { flex: 1, alignItems: 'flex-end' },
  headerTitle: { fontSize: 25, fontWeight: '700', color: colors.textLight, marginRight: 15, marginTop: 30 },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: 30 },
  content: { padding: 20 },

  section: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.primary, marginBottom: 10, textAlign: 'right' },

  // Catégories
  categoryRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.bgLight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: { backgroundColor: colors.primaryLight, borderColor: colors.secondary },
  categoryText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  categoryTextActive: { color: colors.primary },

  // Grille des parties
  partsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  partButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.bgLight,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: '45%',
    alignItems: 'center',
  },
  partButtonActive: { backgroundColor: colors.primaryLight, borderColor: colors.secondary },
  partText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  partTextActive: { color: colors.primary },

  // Info card
  infoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  infoCardTitle: { fontSize: 22, fontWeight: '700', color: colors.primary, textAlign: 'right', marginBottom: 10 },
  infoDetailsContainer: { borderTopWidth: 2, borderTopColor: colors.borderLight, paddingTop: 10, gap: 8 },
  infoDetailRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', gap: 5 },
  infoDetailLabel: { fontSize: 14, fontWeight: '600', color: colors.primary, minWidth: 70, textAlign: 'right' },
  infoDetailValue: { fontSize: 14, color: colors.textSecondary, flex: 1, textAlign: 'right', flexWrap: 'wrap' },

  // Radio
  radioGroup: { gap: 5 },
  radioButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 14,
    padding: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioButtonActive: { backgroundColor: colors.primaryLight, borderColor: colors.secondary },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.textSecondary, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  radioActive: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  radioText: { flex: 1, fontSize: 16, color: colors.textPrimary, textAlign: 'right', fontWeight: '500' },
  radioTextActive: { color: colors.primary, fontWeight: '600' },

  // Input
  numberInput: {
    backgroundColor: colors.bgLight,
    borderRadius: 14,
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    fontWeight: '600',
    color: colors.primary,
  },

  // Bouton
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  startButtonDisabled: { backgroundColor: colors.textSecondary, shadowOpacity: 0, elevation: 0 },
  startButtonText: { fontSize: 20, fontWeight: '700', color: colors.textLight },
});

export default GeneralPartsSelectionScreen;