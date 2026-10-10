import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  TextInput,
  ToastAndroid, Platform,
} from 'react-native';
import colors from '../styles/colors';
import BottomSheetSelect from '../components/BottomSheetSelect';
import quranData from '../data/quranData';

const CustomTestSetupScreen = ({ navigation, route }) => {
  const autoStartParams = route.params;
  const [sourceType, setSourceType] = useState('surahs');
  const [selectedSurahs, setSelectedSurahs] = useState([]);
  const [pageRanges, setPageRanges] = useState([{ from: '', to: '' }]);
  const [selectedHizbs, setSelectedHizbs] = useState([]);
  const [questionCount, setQuestionCount] = useState('10');
  const [mode, setMode] = useState('random');
  const [versesToRead, setVersesToRead] = useState('');

  const [showSurahName, setShowSurahName] = useState(true);

  useEffect(() => {
    if (autoStartParams?.autoStart) {
      navigation.replace('CustomTest', {
        sourceType: autoStartParams.sourceType,
        selectedSurahs: autoStartParams.selectedSurahs,
        pageRanges: autoStartParams.pageRanges,
        selectedHizbs: autoStartParams.selectedHizbs,
        mode: autoStartParams.mode,
        versesToRead: autoStartParams.versesToRead,
      });
    }
  }, [autoStartParams, navigation]);

  const handleAddPageRange = () => {
    setPageRanges([...pageRanges, { from: '', to: '' }]);
  };

  const handleRemovePageRange = (index) => {
    if (pageRanges.length > 1) {
      const newRanges = pageRanges.filter((_, i) => i !== index);
      setPageRanges(newRanges);
    }
  };

  const handlePageRangeChange = (index, field, value) => {
    const newRanges = [...pageRanges];
    newRanges[index][field] = value;
    setPageRanges(newRanges);
  };

  const removeSurah = (surahNumber) => {
    setSelectedSurahs(selectedSurahs.filter(s => s !== surahNumber));
  };

  const removeHizb = (hizbNumber) => {
    setSelectedHizbs(selectedHizbs.filter(h => h !== hizbNumber));
  };

  const hizbsList = Array.from({ length: 60 }, (_, i) => ({
    number: i + 1,
    label: `الحزب ${i + 1}`
  }));

  const surahOptions = quranData.surahs.map(surah => ({
    value: surah.number,
    label: surah.name,
    badge: surah.number,
    sub: `${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · ${surah.verses} آية`,
    meta: `ص ${surah.page}`,
  }));
  const hizbOptions = hizbsList.map(h => ({ value: h.number, label: h.label, badge: h.number }));

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('تنبيه', message);
    }
  };

  const handleVersesToReadFocus = () => {
    const vCount = parseInt(versesToRead) || 3;
    let hasEnoughVerses = false;
    let totalVerses = 0;

    if (sourceType === 'surahs') {
      if (selectedSurahs.length === 0) {
        showToast('الرجاء اختيار سورة واحدة على الأقل أولاً');
        return;
      }
      selectedSurahs.forEach(surahNum => {
        const surah = quranData.surahs.find(s => s.number === surahNum);
        if (surah) totalVerses += surah.verses;
      });
    } else if (sourceType === 'pages') {
      const validRanges = pageRanges.filter(r => r.from && r.to);
      if (validRanges.length === 0) {
        showToast('الرجاء إدخال نطاق صفحات صحيح أولاً');
        return;
      }
      validRanges.forEach(range => {
        const from = parseInt(range.from);
        const to = parseInt(range.to);
        if (from && to && from <= to) {
          totalVerses += (to - from + 1) * 15; // تقريباً 15 آية لكل صفحة
        }
      });
    } else if (sourceType === 'hizbs') {
      if (selectedHizbs.length === 0) {
        showToast('الرجاء اختيار حزب واحد على الأقل أولاً');
        return;
      }
      totalVerses = selectedHizbs.length * 20; // تقريباً 20 آية لكل حزب
    }

    hasEnoughVerses = totalVerses >= vCount;

    if (hasEnoughVerses) {
      showToast(`✓ المصدر المحدد يحتوي على ${totalVerses} آية تقريباً، وهو كافٍ لعدد الآيات المطلوب (${vCount} آية)`);
    } else {
      showToast(`⚠ تحذير: المصدر المحدد يحتوي على ${totalVerses} آية تقريباً فقط، وقد لا يكون كافياً لعدد الآيات المطلوب (${vCount} آية)`);
    }
  };

  const validateAndStart = () => {
    if (sourceType === 'surahs' && selectedSurahs.length === 0) {
      Alert.alert('تنبيه', 'الرجاء اختيار سورة واحدة على الأقل');
      return;
    }

    if (sourceType === 'pages') {
      const validRanges = pageRanges.filter(r => r.from && r.to);
      if (validRanges.length === 0) {
        Alert.alert('تنبيه', 'الرجاء إدخال نطاق صفحات صحيح');
        return;
      }
      for (let range of validRanges) {
        const from = parseInt(range.from);
        const to = parseInt(range.to);
        if (from > to || from < 1 || to > 604) {
          Alert.alert('خطأ', 'نطاق الصفحات غير صحيح (1-604)');
          return;
        }
      }
    }

    if (sourceType === 'hizbs' && selectedHizbs.length === 0) {
      Alert.alert('تنبيه', 'الرجاء اختيار حزب واحد على الأقل');
      return;
    }

    const qCount = parseInt(questionCount);
    if (!qCount || qCount < 1 || qCount > 100) {
      Alert.alert('خطأ', 'عدد الأسئلة يجب أن يكون بين 1 و 100');
      return;
    }

    const vCount = parseInt(versesToRead);
    if (!vCount || vCount < 1 || vCount > 20) {
      Alert.alert('خطأ', 'عدد الآيات يجب أن يكون بين 1 و 20');
      return;
    }

    navigation.navigate('Duaa', {
      sourceType,
      selectedSurahs,
      pageRanges: pageRanges.filter(r => r.from && r.to),
      selectedHizbs,
      questionCount: qCount,
      mode,
      versesToRead: vCount,
      showSurahName: showSurahName,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>أنشئ اختبارك الخاص </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>مصدر الأسئلة</Text>
            
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, sourceType === 'surahs' && styles.radioButtonActive]}
                onPress={() => setSourceType('surahs')}>
                <View style={[styles.radio, sourceType === 'surahs' && styles.radioActive]}>
                  {sourceType === 'surahs' && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioText, sourceType === 'surahs' && styles.radioTextActive]}>
                  سور
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.radioButton, sourceType === 'pages' && styles.radioButtonActive]}
                onPress={() => setSourceType('pages')}>
                <View style={[styles.radio, sourceType === 'pages' && styles.radioActive]}>
                  {sourceType === 'pages' && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioText, sourceType === 'pages' && styles.radioTextActive]}>
                  نطاق صفحات
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.radioButton, sourceType === 'hizbs' && styles.radioButtonActive]}
                onPress={() => setSourceType('hizbs')}>
                <View style={[styles.radio, sourceType === 'hizbs' && styles.radioActive]}>
                  {sourceType === 'hizbs' && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioText, sourceType === 'hizbs' && styles.radioTextActive]}>
                  أحزاب
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {sourceType === 'surahs' && (
            <View style={styles.pickerCard}>
              <BottomSheetSelect
                multiple
                label="السور"
                placeholder="اختر السور"
                title="اختر السور"
                options={surahOptions}
                value={selectedSurahs}
                onChange={setSelectedSurahs}
              />

              {selectedSurahs.length > 0 && (
                <View style={styles.selectedBadges}>
                  {selectedSurahs.map(surahNum => {
                    const surah = quranData.surahs.find(s => s.number === surahNum);
                    return (
                      <View key={surahNum} style={styles.selectedBadge}>
                        <TouchableOpacity
                          onPress={() => removeSurah(surahNum)}
                          style={styles.badgeRemove}>
                          <Text style={styles.badgeRemoveText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.badgeText}>{surah?.name}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {sourceType === 'pages' && (
            <View style={styles.pickerCard}>
              {pageRanges.map((range, index) => (
                <View key={index} style={styles.rangeRow}>
                  <View style={styles.rangeInputs}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>من</Text>
                      <TextInput
                        style={[styles.input, !range.from && styles.inputEmpty]}
                        keyboardType="numeric"
                        value={range.from}
                        onChangeText={(value) => handlePageRangeChange(index, 'from', value)}
                        placeholder="مثال: 1"
                        placeholderTextColor={colors.placeholder}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>إلى</Text>
                      <TextInput
                        style={[styles.input, !range.to && styles.inputEmpty]}
                        keyboardType="numeric"
                        value={range.to}
                        onChangeText={(value) => handlePageRangeChange(index, 'to', value)}
                        placeholder="مثال: 604"
                        placeholderTextColor={colors.placeholder}
                      />
                    </View>
                  </View>
                  {pageRanges.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemovePageRange(index)}>
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddPageRange}>
                <Text style={styles.addButtonText}>+ إضافة نطاق</Text>
              </TouchableOpacity>
            </View>
          )}

          {sourceType === 'hizbs' && (
            <View style={styles.pickerCard}>
              <BottomSheetSelect
                multiple
                label="الأحزاب"
                placeholder="اختر الأحزاب"
                title="اختر الأحزاب"
                options={hizbOptions}
                value={selectedHizbs}
                onChange={setSelectedHizbs}
              />

              {selectedHizbs.length > 0 && (
                <View style={styles.selectedBadges}>
                  {selectedHizbs.map(hizbNum => (
                    <View key={hizbNum} style={styles.selectedBadge}>
                      <TouchableOpacity
                        onPress={() => removeHizb(hizbNum)}
                        style={styles.badgeRemove}>
                        <Text style={styles.badgeRemoveText}>✕</Text>
                      </TouchableOpacity>
                      <Text style={styles.badgeText}>حزب {hizbNum}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.pickerCard}>
            <Text style={styles.label}>عدد الأسئلة</Text>
            <TextInput
              style={[styles.numberInput, !questionCount && styles.inputEmpty]}
              keyboardType="numeric"
              value={questionCount}
              onChangeText={setQuestionCount}
              placeholder="مثال: 10"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}> ترتيب الأسئلة</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, mode === 'sequential' && styles.radioButtonActive]}
                onPress={() => {
                  setMode('sequential');
                  if (Platform.OS === 'android') {
                    ToastAndroid.show('يجب تحديد عدد الأسئلة', ToastAndroid.SHORT);
                  }
                }}>
                <View style={[styles.radio, mode === 'sequential' && styles.radioActive]}>
                  {mode === 'sequential' && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioText, mode === 'sequential' && styles.radioTextActive]}>
                  متسلسل (حسب ترتيب المصحف)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.radioButton, mode === 'random' && styles.radioButtonActive]}
                onPress={() => setMode('random')}>
                <View style={[styles.radio, mode === 'random' && styles.radioActive]}>
                  {mode === 'random' && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioText, mode === 'random' && styles.radioTextActive]}>
                  عشوائي (بدون ترتيب)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pickerCard}>
            <Text style={styles.label}>عدد الآيات للقراءة</Text>
            <TextInput
              value={versesToRead}
              style={[styles.numberInput, !versesToRead && styles.inputEmpty]}
              keyboardType="numeric"
              onChangeText={setVersesToRead}
              onFocus={handleVersesToReadFocus}
              placeholder="مثال: 3"
              placeholderTextColor={colors.placeholder}
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

          <TouchableOpacity
            style={styles.startButton}
            onPress={validateAndStart}
            activeOpacity={0.85}>
            <Text style={styles.startButtonText}>بدء الاختبار</Text>
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
    paddingBottom: 22,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  backButtonText: {
    fontSize: 25,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 58,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
    marginTop: 35,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 14,
  },
  section: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
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
    marginBottom: 3,
    textAlign: 'right',
  },
  radioGroup: {
    gap: 3,
  },
  radioButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: colors.bgLight,
    gap: 10,
  },
  radioButtonActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.primaryLight,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  radioTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  pickerCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
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
    marginBottom: 3,
    textAlign: 'right',
  },
  selectedBadges: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  selectedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    paddingVertical: 2,
    paddingHorizontal: 7,
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  badgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  badgeRemove: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRemoveText: {
    fontSize: 9,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  rangeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  rangeInputs: {
    flex: 1,
    flexDirection: 'row-reverse',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    padding: 7,
    fontSize: 15,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    color: colors.textPrimary,
  },
  removeButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.primaryLight,
    padding: 7,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
  },
  numberInput: {
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    padding: 5,
    fontSize: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 11,
    paddingHorizontal: 32,
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
  },
  inputEmpty: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default CustomTestSetupScreen;