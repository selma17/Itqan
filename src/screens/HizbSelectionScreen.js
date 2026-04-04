import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, Alert, TextInput, ToastAndroid, Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import colors from '../styles/colors';
import { useQuran } from '../context/QuranContext';

const HizbSelectionScreen = ({ navigation }) => {
  const { rawData: quranData } = useQuran();
  const [selectedHizb, setSelectedHizb] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [mode, setMode] = useState('random');
  const [hizbInfo, setHizbInfo] = useState(null);
  const [showSurahName, setShowSurahName] = useState(true);

  useEffect(() => {
    if (selectedHizb) {
      const info = getHizbInfo(parseInt(selectedHizb));
      setHizbInfo(info);
    } else {
      setHizbInfo(null);
    }
  }, [selectedHizb]);

  const getHizbInfo = (hizbNumber) => {
    try {
      if (!quranData || !Array.isArray(quranData)) {
        console.error('quranData n\'est pas disponible ou n\'est pas un tableau');
        return null;
      }
      
      const hizbVerses = quranData.filter(item => {
        return item.hizb !== undefined && item.hizb === hizbNumber;
      });
      
      if (hizbVerses.length === 0) {
        console.log(`Aucun verset trouvé pour le hizb ${hizbNumber}`);
        return null;
      }
      
      const pages = hizbVerses
        .map(item => parseInt(item.page))
        .filter(page => !isNaN(page));
      
      if (pages.length === 0) return null;
      
      const startPage = Math.min(...pages);
      const endPage = Math.max(...pages);
      
      const surahsMap = new Map();
      hizbVerses.forEach(verse => {
        if (verse.sura_no && verse.sura_name_ar) {
          surahsMap.set(verse.sura_no, {
            number: verse.sura_no,
            name: verse.sura_name_ar
          });
        }
      });
      
      const surahs = Array.from(surahsMap.values())
        .sort((a, b) => a.number - b.number);
      
      return {
        number: hizbNumber,
        startPage,
        endPage,
        surahs,
        totalPages: endPage - startPage + 1,
        totalVerses: hizbVerses.length
      };
    } catch (error) {
      console.error('Erreur dans getHizbInfo:', error);
      return null;
    }
  };

  const handleStartTest = () => {
    if (!selectedHizb) {
      Alert.alert('تنبيه', 'الرجاء اختيار حزب');
      return;
    }
    if (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0)) {
      Alert.alert('تنبيه', 'يجب تحديد عدد الأسئلة عند اختيار الوضع المتسلسل');
      return;
    }
    navigation.navigate('Duaa', {
      testType: 'Hizb',
      hizbNumber: parseInt(selectedHizb),
      selectionMode: mode,
      questionCount: questionCount ? parseInt(questionCount) : null,
      showSurahName: showSurahName,
    });
  };

  const hizbsList = Array.from({ length: 60 }, (_, i) => ({
    number: i + 1,
    label: `الحزب ${i + 1}`
  }));

  const selectedHizbData = selectedHizb
    ? hizbsList.find(h => h.number === parseInt(selectedHizb))
    : null;

  const isButtonDisabled = !selectedHizb || (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>اختبار حسب الحزب</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>
          <View style={styles.pickerCard}>
            <Text style={styles.label}>اختر الحزب:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedHizb}
                onValueChange={(itemValue) => setSelectedHizb(itemValue)}
                style={styles.picker}
                dropdownIconColor={colors.primary}
                mode="dropdown">
                <Picker.Item label="-- حزب --" value="" style={styles.pickerItem} />
                {hizbsList.map((hizb) => (
                  <Picker.Item
                    key={hizb.number}
                    label={hizb.label}
                    value={hizb.number.toString()}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
              <View style={styles.pickerUnderline} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ترتيب الأسئلة</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, mode === 'sequential' && styles.radioButtonActive]}
                onPress={() => {
                  setMode('sequential');
                  if (Platform.OS === 'android') {
                    ToastAndroid.show('يجب تحديد عدد الأسئلة', ToastAndroid.SHORT);
                  }
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

          <View style={styles.pickerCard}>
            <Text style={styles.label}>
              عدد الأسئلة
            </Text>
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

          {selectedHizbData && (
            <View style={styles.hizbInfoCard}>
              <View style={styles.hizbInfoHeader}>
                <View style={styles.hizbNameContainer}>
                  <Text style={styles.hizbName}>{selectedHizbData.label}</Text>
                </View>
              </View>
              
              {/* Nouvelles informations ajoutées */}
              {hizbInfo && (
                <View style={styles.hizbDetailsContainer}>
                  {/* Informations sur les pages */}
                  <View style={styles.hizbDetailRow}>
                    <Text style={styles.hizbDetailLabel}>الصفحات:</Text>
                    <Text style={styles.hizbDetailValue}>
                      {hizbInfo.startPage} - {hizbInfo.endPage}
                      {` (${hizbInfo.totalPages} صفحة)`}
                    </Text>
                  </View>
                  
                  {/* Informations sur les sourates */}
                  <View style={styles.hizbDetailRow}>
                    <Text style={styles.hizbDetailLabel}>السور:</Text>
                    <Text style={styles.hizbDetailValue}>
                      {hizbInfo.surahs?.map(surah => surah.name).join('، ') || 'غير محدد'}
                    </Text>
                  </View>
                  
                  {/* Informations supplémentaires */}
                  <View style={styles.hizbDetailRow}>
                    <Text style={styles.hizbDetailLabel}>عدد الآيات:</Text>
                    <Text style={styles.hizbDetailValue}>
                      {hizbInfo.totalVerses} آية
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>عرض اسم السورة التي ورد فيها الموضع</Text>
            <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
              <TouchableOpacity
                style={[styles.radioButton, { flex: 1 }, showSurahName === true && styles.radioButtonActive]}
                onPress={() => setShowSurahName(true)}>
                <Text style={[styles.radioText, showSurahName === true && styles.radioTextActive]}>
                  نعم
                </Text>
                <View style={[styles.radio, showSurahName === true && styles.radioActive]}>
                  {showSurahName === true && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, { flex: 1 }, showSurahName === false && styles.radioButtonActive]}
                onPress={() => setShowSurahName(false)}>
                <Text style={[styles.radioText, showSurahName === false && styles.radioTextActive]}>
                  لا
                </Text>
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
                ? (mode === 'sequential' && !questionCount ? 'حدد عدد الأسئلة أولاً' : 'اختر الحزب أولاً')
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
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
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
  backButtonText: {
    fontSize: 25,
    color: colors.textLight,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.textLight,
    marginRight: 15,
    marginTop: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  content: {
    padding: 20,
  },
  pickerCard: {
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
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 5,
    textAlign: 'right',
  },
  pickerWrapper: {
    position: 'relative',
  },
  picker: {
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    color: colors.textPrimary,
  },
  pickerItem: {
    fontSize: 16,
    textAlign: 'right',
  },
  pickerUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.secondary,
    borderRadius: 1,
  },
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 5,
    textAlign: 'right',
  },
  radioGroup: {
    gap: 5,
  },
  radioButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 14,
    padding: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.secondary,
  },
  radio: {
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: colors.textSecondary,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 12,
  },
  radioActive: { 
    borderColor: colors.primary 
  },
  radioInner: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: colors.primary 
  },
  radioText: {
    flex: 1, 
    fontSize: 16, 
    color: colors.textPrimary, 
    textAlign: 'right', 
    fontWeight: '500',
  },
  radioTextActive: { 
    color: colors.primary, 
    fontWeight: '600' 
  },
  warningBox: {
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    backgroundColor: '#FFF3CD',
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 20, 
    borderWidth: 1,
    borderColor: '#FFE69C', 
    gap: 12,
  },
  warningIcon: { 
    fontSize: 20 
  },
  warningText: {
    flex: 1, 
    fontSize: 14, 
    color: '#856404', 
    textAlign: 'right', 
    fontWeight: '600',
  },
  hizbInfoCard: {
    backgroundColor: colors.primaryLight, 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 24,
    borderWidth: 2, 
    borderColor: colors.secondary,
  },
  hizbInfoHeader: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    gap: 16 
  },
  hizbNumberBadge: {
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: colors.primary,
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 3,
  },
  hizbNumberText: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: colors.textLight 
  },
  hizbNameContainer: { 
    flex: 1, 
    alignItems: 'flex-end' 
  },
  hizbName: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: colors.primary,  
  },
  hizbDetailsContainer: {
    marginTop: 5,
    paddingTop: 12,
    borderTopWidth: 3,
    borderTopColor: colors.borderLight,
    gap: 8,
  },
  hizbDetailRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 5,
  },
  hizbDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 60,
    textAlign: 'right',
  },
  hizbDetailValue: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
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
  },
  startButtonDisabled: { 
    backgroundColor: colors.textSecondary, 
    shadowOpacity: 0, 
    elevation: 0 
  },
  startButtonText: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: colors.textLight 
  },
});

export default HizbSelectionScreen;