import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, TextInput, Alert, ToastAndroid, Platform,
} from 'react-native';
import colors from '../styles/colors';

const PageSelectionScreen = ({ navigation }) => {
  const [pageFrom, setPageFrom] = useState('');
  const [pageTo, setPageTo] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [mode, setMode] = useState('random');
  const [showSurahName, setShowSurahName] = useState('');

  const handleStartTest = () => {
    const from = parseInt(pageFrom);
    const to = parseInt(pageTo);

    if (!pageFrom || !pageTo) {
      Alert.alert('تنبيه', 'الرجاء إدخال نطاق الصفحات');
      return;
    }

    if (from < 1 || from > 604 || to < 1 || to > 604) {
      Alert.alert('خطأ', 'يجب أن تكون الصفحات بين 1 و 604');
      return;
    }

    if (from > to) {
      Alert.alert('خطأ', 'رقم الصفحة الأولى يجب أن يكون أقل من أو يساوي رقم الصفحة الأخيرة');
      return;
    }

    if (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0)) {
      Alert.alert('تنبيه', 'يجب تحديد عدد الأسئلة عند اختيار الوضع المتسلسل');
      return;
    }

    navigation.navigate('Duaa', {
      testType: 'pages',
      pageFrom: from,
      pageTo: to,
      selectionMode: mode,
      questionCount: questionCount ? parseInt(questionCount) : null,
      showSurahName: showSurahName,
    });
  };

  const isValid = pageFrom && pageTo && 
    parseInt(pageFrom) >= 1 && parseInt(pageFrom) <= 604 &&
    parseInt(pageTo) >= 1 && parseInt(pageTo) <= 604 &&
    parseInt(pageFrom) <= parseInt(pageTo);

  const pageCount = isValid ? parseInt(pageTo) - parseInt(pageFrom) + 1 : 0;
  const isButtonDisabled = !isValid || (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>مواضع في صفحات معينة</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        <View style={styles.content}>
          <View style={styles.inputCard}>
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>من الصفحة</Text>
              <View style={styles.separatorLine} />
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={pageFrom}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    setPageFrom(cleaned);
                  }}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={3}
                  returnKeyType="next"
                />
                <View style={styles.inputUnderline} />
              </View>
            </View>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>إلى الصفحة</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={pageTo}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    setPageTo(cleaned);
                  }}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={3}
                  returnKeyType="done"
                />
                <View style={styles.inputUnderline} />
              </View>
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
          
          {isValid && (
            <View style={styles.rangeInfoCard}>  
              <View style={styles.pageCountBox}>
                <Text style={styles.pageCountLabel}>عدد الصفحات:</Text>
                <Text style={styles.pageCountValue}>{pageCount}</Text>
              </View>
            </View>
          )}

            <View style={styles.helpBox}>
            <Text style={styles.helpIcon}>ℹ️</Text>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>معلومة</Text>
              <Text style={styles.helpText}>
                القرآن الكريم يحتوي على 604 صفحات في مصحف المدينة النبوية
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startButton, isButtonDisabled && styles.startButtonDisabled]}
            onPress={handleStartTest}
            activeOpacity={0.85}
            disabled={isButtonDisabled}>
            <Text style={styles.startButtonText}>
              {isButtonDisabled 
                ? (mode === 'sequential' && !questionCount ? 'حدد عدد الأسئلة أولاً' : 'أدخل نطاق الصفحات')
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
    backgroundColor: colors.bgLight 
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
    flex: 1
  },
  scrollViewContent: { 
    paddingBottom: 30
  },
  content: { 
    padding: 20
  },
  inputCard: {
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
  inputContainer: { 
    position: 'relative' 
  },
  input: {
    backgroundColor: colors.bgLight, 
    borderRadius: 14, 
    padding: 10, 
    fontSize: 24,
    textAlign: 'center', 
    color: colors.primary, 
    fontWeight: '700',
  },
  inputUnderline: {
    position: 'absolute', 
    bottom: 0, 
    left: 20, 
    right: 20, 
    height: 2,
    backgroundColor: colors.secondary, 
    borderRadius: 2,
  },
  separator: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 20, 
    gap: 12 
  },
  separatorLine: { 
    flex: 1, 
    height: 1, 
    backgroundColor: colors.border 
  },
  separatorText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.textSecondary 
  },
  pickerCard: {
    backgroundColor: colors.bgWhite, 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 20,
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
    marginBottom: 10, 
    textAlign: 'right',
  },
  numberInput: {
    backgroundColor: colors.bgLight,
    borderRadius: 14,
    padding: 15,
    fontSize: 20,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    textAlign: 'center',
    fontWeight: '700',
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
    borderColor: colors.border,
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
  rangeInfoCard: {
    backgroundColor: colors.primaryLight, 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 2, 
    borderColor: colors.secondary,
  },
  pageCountBox: {
    flexDirection: 'row-reverse', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8,
  },
  pageCountLabel: { 
    fontSize: 15, 
    color: colors.textSecondary, 
    fontWeight: '600' 
  },
  pageCountValue: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: colors.secondary 
  },
  helpBox: {
    flexDirection: 'row-reverse', 
    backgroundColor: colors.bgWhite, 
    padding: 16,
    borderRadius: 16, 
    marginBottom: 24, 
    gap: 12, 
    borderWidth: 1, 
    borderColor: colors.borderLight,
  },
  helpIcon: { 
    fontSize: 20 
  },
  helpContent: { 
    flex: 1 
  },
  helpTitle: {
    fontSize: 15, 
    fontWeight: '600', 
    color: colors.primary, 
    marginBottom: 4, 
    textAlign: 'right',
  },
  helpText: {
    fontSize: 13, 
    color: colors.textSecondary, 
    textAlign: 'right', 
    lineHeight: 20,
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

export default PageSelectionScreen;