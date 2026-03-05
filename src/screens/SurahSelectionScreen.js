import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  ToastAndroid, Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import colors from '../styles/colors';
import quranData from '../data/quranData';

const SurahSelectionScreen = ({ navigation }) => {
  const [selectedSurah, setSelectedSurah] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [mode, setMode] = useState('random');

  const handleStartTest = () => {
    if (!selectedSurah) {
      Alert.alert('تنبيه', 'الرجاء اختيار سورة');
      return;
    }

    if (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0)) {
      Alert.alert('تنبيه', 'يجب تحديد عدد الأسئلة عند اختيار الوضع المتسلسل');
      return;
    }

    navigation.navigate('Duaa', {
      testType: 'surah',
      surahNumber: parseInt(selectedSurah),
      selectionMode: mode,
      questionCount: questionCount ? parseInt(questionCount) : null,
    });
  };

  const selectedSurahData = selectedSurah 
    ? quranData.surahs.find(s => s.number === parseInt(selectedSurah))
    : null;

  // Validation du bouton
  const isButtonDisabled = !selectedSurah || (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>مواضع في سورة معينة</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>

          <View style={styles.pickerCard}>
            <Text style={styles.label}>اختر السورة:</Text>
            
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedSurah}
                onValueChange={(itemValue) => setSelectedSurah(itemValue)}
                style={styles.picker}
                dropdownIconColor={colors.primary}
                mode="dropdown">
                <Picker.Item 
                  label="-- سورة --" 
                  value="" 
                  style={styles.pickerItem}
                />
                {quranData.surahs.map((surah) => (
                  <Picker.Item
                    key={surah.number}
                    label={`${surah.number}. ${surah.name} - ${surah.verses} آية`}
                    value={surah.number.toString()}
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
              placeholder="--"
              placeholderTextColor={colors.textSecondary}
              textAlign="center"
            />
          </View>

          {mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0) && (
            <View style={styles.warningBox}>
              
            </View>
          )}

          {selectedSurahData && (
            <View style={styles.surahInfoCard}>
              <View style={styles.surahInfoHeader}>
                <View style={styles.surahNumberBadge}>
                  <Text style={styles.surahNumberText}>{selectedSurahData.number}</Text>
                </View>
                <View style={styles.surahNameContainer}>
                  <Text style={styles.surahName}>{selectedSurahData.name}</Text>
                  <Text style={styles.surahType}>
                    {selectedSurahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.surahStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>عدد الآيات</Text>
                  <Text style={styles.statValue}>{selectedSurahData.verses}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>رقم الصفحة</Text>
                  <Text style={styles.statValue}>{selectedSurahData.page}</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.startButton,
              isButtonDisabled && styles.startButtonDisabled
            ]}
            onPress={handleStartTest}
            activeOpacity={0.85}
            disabled={isButtonDisabled}>
            <Text style={styles.startButtonText}>
              {isButtonDisabled 
                ? (mode === 'sequential' && !questionCount ? 'حدد عدد الأسئلة أولاً' : 'اختر السورة أولاً')
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
    borderRadius: 12,
    padding: 10,
    fontSize: 20,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: "700"
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
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
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
    fontWeight: '600',
  },
  surahInfoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  surahInfoHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  surahNumberBadge: {
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
  surahNumberText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
  },
  surahNameContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  surahType: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  surahStats: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.bgWhite,
    borderRadius: 14,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
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
    elevation: 0,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
  },
});

export default SurahSelectionScreen;