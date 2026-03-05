import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';
import quranData from '../data/qaloonQuran.json';

const CustomResultsScreen = ({ navigation, route }) => {
  const {
    score,
    errors,
    totalQuestions,
    duration,
    sourceType,
    selectedSurahs,
    pageRanges,
    selectedHizbs,
    mode,
    versesToRead,
  } = route.params;

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Sauvegarder les paramètres du test dès l'arrivée sur l'écran des résultats
  useEffect(() => {
    const saveTestParams = async () => {
      try {
        const testParams = {
          sourceType,
          selectedSurahs,
          pageRanges,
          selectedHizbs,
          mode,
          versesToRead,
          questionCount: totalQuestions,
        };
        await AsyncStorage.setItem('lastTestParams', JSON.stringify(testParams));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres:', error);
      }
    };

    saveTestParams();
  }, [sourceType, selectedSurahs, pageRanges, selectedHizbs, mode, versesToRead, totalQuestions]);

  // Extraire les noms des sourates du fichier de données
  const surahNames = useMemo(() => {
    const names = {};
    quranData.forEach(verse => {
      if (!names[verse.sura_no]) {
        names[verse.sura_no] = verse.sura_name_ar;
      }
    });
    return names;
  }, []);

  // Obtenir le nom d'une sourate
  const getSurahName = (surahNumber) => {
    return surahNames[surahNumber] || `سورة ${surahNumber}`;
  };

  // Obtenir les informations d'un hizb
  const getHizbInfo = (hizbNumber) => {
    const hizbVerses = quranData.filter(v => v.hizb === hizbNumber);
    if (hizbVerses.length === 0) return `حزب ${hizbNumber}`;
    
    const firstVerse = hizbVerses[0];
    const lastVerse = hizbVerses[hizbVerses.length - 1];
    
    if (firstVerse.sura_name_ar === lastVerse.sura_name_ar) {
      return `${firstVerse.sura_name_ar}`;
    }
    return `${firstVerse.sura_name_ar} - ${lastVerse.sura_name_ar}`;
  };

  // Obtenir les informations d'une page
  const getPageSurahs = (pageNum) => {
    const pageVerses = quranData.filter(v => parseInt(v.page) === pageNum);
    const surahs = [...new Set(pageVerses.map(v => v.sura_name_ar))];
    return surahs;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}س ${mins}د ${secs}ث`;
    } else if (mins > 0) {
      return `${mins}د ${secs}ث`;
    } else {
      return `${secs}ث`;
    }
  };

  const getSourceDescription = () => {
    if (sourceType === 'surahs') {
      if (selectedSurahs.length === 1) {
        return getSurahName(selectedSurahs[0]);
      }
      return `${selectedSurahs.length} سور`;
    } else if (sourceType === 'pages') {
      const totalPages = pageRanges.reduce((sum, range) => {
        return sum + (parseInt(range.to) - parseInt(range.from) + 1);
      }, 0);
      return `${totalPages} صفحة`;
    } else if (sourceType === 'hizbs') {
      if (selectedHizbs.length === 1) {
        return getHizbInfo(selectedHizbs[0]);
      }
      return `${selectedHizbs.length} أحزاب`;
    }
    return '';
  };

  const getModeDescription = () => {
    return mode === 'sequential' ? 'متسلسل' : 'عشوائي';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) {
      return {
        emoji: '🌟',
        title: 'ممتاز!',
        message: 'أداء رائع! حفظك متقن بإذن الله',
        color: colors.success,
      };
    } else if (percentage >= 70) {
      return {
        emoji: '👍',
        title: 'جيد جداً!',
        message: 'أداء جيد، استمر في المراجعة',
        color: colors.primary,
      };
    } else if (percentage >= 50) {
      return {
        emoji: '📖',
        title: 'جيد',
        message: 'تحتاج المزيد من المراجعة',
        color: colors.secondary,
      };
    } else {
      return {
        emoji: '💪',
        title: 'استمر!',
        message: 'راجع حفظك وحاول مرة أخرى',
        color: colors.error,
      };
    }
  };

  const performance = getPerformanceMessage();

  // Fonction pour refaire le même test avec les paramètres sauvegardés
  const handleRetryTest = async () => {
    try {
      const savedParams = await AsyncStorage.getItem('lastTestParams');
      if (savedParams) {
        const params = JSON.parse(savedParams);
        // Naviguer directement vers CustomTest avec les paramètres stockés
        navigation.navigate('Duaa', params);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      // Fallback : utiliser les paramètres actuels
      navigation.navigate('Duaa', {
        sourceType,
        selectedSurahs,
        pageRanges,
        selectedHizbs,
        mode,
        versesToRead,
        questionCount: totalQuestions,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>نتيجة الاختبار</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Compact Performance Card */}
        <View style={[styles.performanceCard, { borderRightColor: performance.color }]}>
          <View style={styles.performanceContent}>
            <View style={styles.performanceTextContainer}>
              <Text style={styles.performanceEmoji}>{performance.emoji}</Text>
              <View style={styles.performanceText}>
                <Text style={[styles.performanceTitle, { color: performance.color }]}>
                  {performance.title}
                </Text>
                <Text style={styles.performanceMessage}>{performance.message}</Text>
              </View>
            </View>
            
            <View style={styles.percentageCircle}>
              <Text style={[styles.percentageText, { color: performance.color }]}>
                {percentage}%
              </Text>
            </View>
          </View>
        </View>

        {/* Redesigned Stats Section */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>النتائج التفصيلية</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statRow}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}> إجمالي الأسئلة : {totalQuestions} </Text>
              </View>
              <View style={[styles.statIconContainer, { backgroundColor: colors.secondaryLight }]}>
                <Text style={styles.statIcon}>📝</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statRow}>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.success }]}>إجابات صحيحة : {score} </Text>
              </View>
              <View style={[styles.statIconContainer, { backgroundColor: colors.successLight }]}>
                <Text style={styles.statIcon}>✓</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statRow}>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.error }]}>إجابات خاطئة : {errors}</Text>
              </View>
              <View style={[styles.statIconContainer, { backgroundColor: colors.errorLight }]}>
                <Text style={styles.statIcon}>✗</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Test Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>معلومات الاختبار</Text>
          </View>

          <View style={styles.infoContent}>
            {/* Source Info */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>المصدر</Text>
              <Text style={styles.infoValue}>{getSourceDescription()}</Text>
            </View>

            {/* Detailed Source Info for Surahs */}
            {sourceType === 'surahs' && selectedSurahs.length > 1 && selectedSurahs.length <= 5 && (
              <View style={styles.detailsContainer}>
                {selectedSurahs.map((surahNum) => (
                  <View key={surahNum} style={styles.detailChip}>
                    <Text style={styles.detailChipText}>{getSurahName(surahNum)}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Page Ranges with Surah Info */}
            {sourceType === 'pages' && (
              <View style={styles.detailsContainer}>
                {pageRanges.map((range, index) => {
                  const startPageSurahs = getPageSurahs(parseInt(range.from));
                  const endPageSurahs = getPageSurahs(parseInt(range.to));
                  const allSurahs = [...new Set([...startPageSurahs, ...endPageSurahs])];
                  
                  return (
                    <View key={index} style={styles.pageRangeDetail}>
                      <View style={styles.detailChip}>
                        <Text style={styles.detailChipText}>
                          صفحة {range.from} - {range.to}
                        </Text>
                      </View>
                      {allSurahs.length > 0 && (
                        <Text style={styles.surahHint}>
                          {allSurahs.join(' • ')}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Hizbs with Surah Info */}
            {sourceType === 'hizbs' && selectedHizbs.length > 1 && selectedHizbs.length <= 5 && (
              <View style={styles.detailsContainer}>
                {selectedHizbs.map((hizbNum) => (
                  <View key={hizbNum} style={styles.detailChip}>
                    <Text style={styles.detailChipText}>
                      حزب {hizbNum} • {getHizbInfo(hizbNum)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.infoDivider} />

            {/* Mode */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>النمط</Text>
              <Text style={styles.infoValue}>{getModeDescription()}</Text>
            </View>

            <View style={styles.infoDivider} />

            {/* Verses to Read */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>عدد الآيات للقراءة</Text>
              <Text style={styles.infoValue}>{versesToRead} آيات</Text>
            </View>

            <View style={styles.infoDivider} />

            {/* Duration */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>مدة الاختبار </Text>
              <View style={styles.durationContainer}>
                <Text style={styles.infoValue}>{formatTime(duration)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetryTest}
            activeOpacity={0.85}>
            <View style={styles.buttonContent}>
              <Text style={styles.retryButtonText}>إعادة نفس الاختبار</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newTestButton}
            onPress={() => navigation.navigate('CustomTestSetup')}
            activeOpacity={0.85}>
            <Text style={styles.newTestButtonText}>اختبار مخصص جديد</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.85}>
            <Text style={styles.homeButtonText}>العودة للرئيسية</Text>
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
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 35,
  },
  headerTitle: {
    fontSize: 33,
    fontWeight: '700',
    color: colors.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },

  // Compact Performance Card
  performanceCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderRightWidth: 5,
  },
  performanceContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  performanceTextContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  performanceEmoji: {
    fontSize: 40,
  },
  performanceText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  performanceTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  performanceMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  percentageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
  },

  // Redesigned Stats Card
  statsCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsHeader: {
    backgroundColor: colors.bgLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  statsTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  statsGrid: {
    padding: 16,
  },
  statRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  statIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
  },
  statContent: {
    alignItems: 'flex-end',
    flex: 1,
    paddingRight: 16,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statDivider: {
    height: 2,
    backgroundColor: colors.secondary,
    marginVertical: 4,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoHeader: {
    backgroundColor: colors.bgLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  infoContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 17,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  infoDivider: {
    height: 2,
    backgroundColor: colors.secondary,
    marginVertical: 4,
  },
  detailsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  detailChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailChipText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  pageRangeDetail: {
    width: '100%',
    marginBottom: 8,
    
  },
  surahHint: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
    fontStyle: 'italic',
  },
  durationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  // Action Buttons
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  retryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.secondary,
  },

  newTestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newTestButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.secondary,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: colors.bgLight,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  homeButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
});

export default CustomResultsScreen;