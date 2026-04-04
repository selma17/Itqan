import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import colors from '../styles/colors';
import { useQuran } from '../context/QuranContext';
import { wp, hp, fp, SPACING, FONT_SIZES, RADIUS } from '../utils/responsive';
import { useFonts, ScheherazadeNew_400Regular } from '@expo-google-fonts/scheherazade-new';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F4E4C1';

const CustomTestScreen = ({ navigation, route }) => {
  const { quranData } = useQuran();
  if (!quranData) return null;
  let [fontsLoaded] = useFonts({ ScheherazadeNew_400Regular,});
  const [fontLoaded, setFontLoaded] = useState(false);
  const {
    sourceType,
    selectedSurahs,
    pageRanges,
    selectedHizbs,
    questionCount,
    mode,
    versesToRead,
    showSurahName = true
  } = route.params;

  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [versesReadCount, setVersesReadCount] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);
  const timerRef = useRef(null);
  
  const [verseFontSize, setVerseFontSize] = useState(fp(25));

  useEffect(() => {
    AsyncStorage.getItem('verse_font_step').then(val => {
      const steps = [fp(19), fp(25), fp(31), fp(37)];
      if (val !== null) setVerseFontSize(steps[Number(val)] ?? fp(25));
    });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const hasEnoughFollowingVerses = (verse, allVerses, neededCount) => {
    const verseIndex = allVerses.findIndex(
      v => v.surahNumber === verse.surahNumber && v.verseNumber === verse.verseNumber
    );
    
    if (verseIndex === -1) return false;
    
    let count = 0;
    for (let i = verseIndex + 1; i < allVerses.length && count < neededCount; i++) {
      if (allVerses[i].surahNumber === verse.surahNumber) {
        count++;
      } else {
        break;
      }
    }
    
    return count >= neededCount;
  };

  const getAllVersesFromSources = () => {
    let allVerses = [];

    if (sourceType === 'surahs') {
      selectedSurahs.forEach(surahNum => {
        const verses = quranData.versesDetailed[surahNum] || [];
        verses.forEach(verse => {
          allVerses.push({
            surahNumber: surahNum,
            surahName: quranData.getSurahName(surahNum),
            verseNumber: verse.number,
            text: verse.text,
            page: verse.page,
            juz: verse.juz,
          });
        });
      });
    } else if (sourceType === 'pages') {
      pageRanges.forEach(range => {
        const from = parseInt(range.from);
        const to = parseInt(range.to);
        for (let page = from; page <= to; page++) {
          const pageVerses = quranData.getVersesByPage(page) || [];
          pageVerses.forEach(verse => {
            allVerses.push({
              surahNumber: verse.surahNumber,
              surahName: verse.surahName,
              verseNumber: verse.verseNumber,
              text: verse.text,
              page: verse.page || page,
              juz: verse.juz,
            });
          });
        }
      });
    } else if (sourceType === 'hizbs') {
      selectedHizbs.forEach(hizbNum => {
        const hizbVerses = quranData.getVersesByHizb(hizbNum) || [];
        hizbVerses.forEach(verse => {
          allVerses.push({
            surahNumber: verse.surahNumber,
            surahName: verse.surahName,
            verseNumber: verse.verseNumber,
            text: verse.text,
            page: verse.page,
            juz: verse.juz,
          });
        });
      });
    }

    return allVerses;
  };

  useEffect(() => {
    const generateQuestions = () => {
      const allVerses = getAllVersesFromSources();

      if (allVerses.length === 0) {
        Alert.alert('خطأ', 'لم يتم العثور على آيات');
        navigation.goBack();
        return;
      }

      let questions = [];

      if (mode === 'sequential') {
        allVerses.sort((a, b) => {
          if (a.surahNumber !== b.surahNumber) {
            return a.surahNumber - b.surahNumber;
          }
          return a.verseNumber - b.verseNumber;
        });

        const validStartPoints = [];
        for (let i = 0; i < allVerses.length; i++) {
          if (hasEnoughFollowingVerses(allVerses[i], allVerses, versesToRead)) {
            validStartPoints.push(i);
          }
        }

        if (validStartPoints.length === 0) {
          Alert.alert('خطأ', 'لا توجد آيات كافية لإنشاء الاختبار بهذه المعايير');
          navigation.goBack();
          return;
        }

        const shuffled = [...validStartPoints];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const selectedIndices = shuffled.slice(0, Math.min(questionCount, shuffled.length)).sort((a, b) => a - b);
        questions = selectedIndices.map(index => allVerses[index]);

      } else {
        const validVerses = allVerses.filter(verse => 
          hasEnoughFollowingVerses(verse, allVerses, versesToRead)
        );

        if (validVerses.length === 0) {
          Alert.alert('خطأ', 'لا توجد آيات كافية لإنشاء الاختبار بهذه المعايير');
          navigation.goBack();
          return;
        }

        const shuffled = [...validVerses];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        questions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
      }

      setAllQuestions(questions);
      if (questions.length > 0) {
        setCurrentVerse(questions[0]);
      }
      setLoading(false);
    };

    generateQuestions();
  }, []);

  const handleNextVerse = () => {
    if (!currentVerse) return;

    if (versesReadCount >= versesToRead) {
      Alert.alert('تنبيه', 'لقد أنهيت قراءة الآيات المطلوبة. انتقل للسؤال التالي');
      return;
    }

    const verses = quranData.versesDetailed[currentVerse.surahNumber];
    if (!verses) return;

    const currentIndex = verses.findIndex(v => v.number === currentVerse.verseNumber);

    if (currentIndex < verses.length - 1) {
      const nextVerse = verses[currentIndex + 1];
      setCurrentVerse({
        surahNumber: currentVerse.surahNumber,
        surahName: currentVerse.surahName,
        verseNumber: nextVerse.number,
        text: nextVerse.text,
        page: nextVerse.page,
        juz: nextVerse.juz,
      });
      setVersesReadCount(versesReadCount + 1);
    } else {
      Alert.alert('تنبيه', 'هذه هي الآية الأخيرة في السورة');
    }
  };

  const handleNextQuestion = () => {
    const isCompleted = versesReadCount >= versesToRead;
    if (!isCompleted && !currentQuestionAnswered) {
      Alert.alert(
        'تأكيد',
        'هل نسيت هذا الموضع ؟ ',
        [
          {
            text: 'إلغاء',
            style: 'cancel',
            onPress: () => {
              return;
            }
          },
          {
            text: 'نعم',
            style: 'destructive',
            onPress: () => {
              setErrors(errors + 1);
              setCurrentQuestionAnswered(true);
              
              if (currentQuestionIndex < allQuestions.length - 1) {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setCurrentVerse(allQuestions[nextIndex]);
                setVersesReadCount(0);
                setCurrentQuestionAnswered(false);
              } else {
                handleFinishTest();
              }
            }
          }
        ]
      );
      return;
    }

    if (!currentQuestionAnswered) {
      if (isCompleted) {
        setScore(score + 1);
      } else {
        setErrors(errors + 1);
      }
      
      setCurrentQuestionAnswered(true);
    }

    if (currentQuestionIndex < allQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentVerse(allQuestions[nextIndex]);
      setVersesReadCount(0);
      setCurrentQuestionAnswered(false);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let finalScore = score;
    let finalErrors = errors;
    
    if (!currentQuestionAnswered) {
      const isCompleted = versesReadCount >= versesToRead;
      if (isCompleted) {
        finalScore += 1;
      } else {
        finalErrors += 1;
      }
    }

    const questionsAnswered = currentQuestionIndex + 1;
    const remainingQuestions = allQuestions.length - questionsAnswered;

    navigation.navigate('CustomResults', {
      score: finalScore,
      errors: finalErrors + remainingQuestions,
      totalQuestions: allQuestions.length,
      duration: elapsedTime,
      sourceType,
      selectedSurahs,
      pageRanges,
      selectedHizbs,
      mode,
      versesToRead,
    });
  };

  const handleQuitConfirm = () => {
    setShowQuitModal(false);
    handleFinishTest();
  };

  if (loading || !currentVerse) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل الاختبار...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canGoToNextQuestion = versesReadCount >= versesToRead;
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;

  const getMainButtonText = () => {
    if (isLastQuestion) {
      return canGoToNextQuestion ? 'إنهاء الاختبار ✓' : 'إنهاء الاختبار (خطأ)';
    }
    return canGoToNextQuestion ? 'السؤال التالي ✓' : 'السؤال التالي (خطأ)';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowQuitModal(true)}>
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>اختبار مخصص</Text>
          <Text style={styles.headerSubtitle}>⏱ {formatTime(elapsedTime)}</Text>
        </View>
      </View>

      <View style={styles.scoreBar}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{errors}</Text>
          <Text style={styles.scoreLabel}>✗</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>✓</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.questionInfo}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionNumber}>{currentQuestionIndex + 1}/{allQuestions.length}</Text>
          </View>
          <View style={styles.questionTextContainer}>
            <Text style={styles.surahName}>
              {showSurahName ? `سورة ${currentVerse.surahName}` : '-------'}
            </Text>
            <Text style={styles.instructionText}>
              اقرأ من قوله تعالى (آية {currentVerse.verseNumber}):
            </Text>
          </View>
        </View>
        <View style={styles.bismillahBox}>
          <Text style={styles.bismillah}>﷽</Text>
        </View>
        <View style={styles.verseCardContainer}>
          <View style={styles.verseCard}>
            <View style={styles.verseOrnament} />
            <ScrollView
              style={styles.verseScrollView}
              contentContainerStyle={styles.verseScrollContent}
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}>
              <Text style={[styles.verseText, { fontSize: verseFontSize, lineHeight: verseFontSize * 1.8 }]}>{currentVerse.text}</Text>
            </ScrollView>
            <View style={styles.verseOrnament} />

            <View style={styles.verseMetadata}>
              <Text style={styles.metadataText}>
                صفحة {currentVerse.page} • جزء {currentVerse.juz}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            {Math.min(versesReadCount, versesToRead)}/{versesToRead}
            {canGoToNextQuestion && ' ✓'}
          </Text>
        </View>
      </View>
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleNextVerse}
            activeOpacity={0.8}
            disabled={versesReadCount >= versesToRead}>
            <Text style={[
              styles.controlButtonText,
              versesReadCount >= versesToRead && styles.controlButtonTextDisabled
            ]}>
              الآية التالية
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
                styles.mainButton,
                canGoToNextQuestion ? styles.mainButtonSuccess : styles.mainButtonError
            ]}
            onPress={handleNextQuestion}
            activeOpacity={0.85}>
            <Text style={styles.mainButtonText}>
                {getMainButtonText()}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
            style={styles.quitButton}
            onPress={() => setShowQuitModal(true)}
            activeOpacity={0.8}>
            <Text style={styles.quitButtonText}>إنهاء</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showQuitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuitModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تأكيد الخروج</Text>
            <Text style={styles.modalText}>
              هل تريد إنهاء الاختبار؟ سيتم احتساب الأسئلة المتبقية كأخطاء.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setShowQuitModal(false)}
                activeOpacity={0.85}>
                <Text style={styles.modalButtonText}>متابعة</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleQuitConfirm}
                activeOpacity={0.85}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                  إنهاء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: colors.textSecondary,
  },

  header: {
    backgroundColor: colors.primary,
    paddingVertical: hp(12),
    paddingHorizontal: wp(16),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.2,
    shadowRadius: wp(4),
    elevation: 3,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  backButton: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(10),
    marginTop: hp(15),
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
  },
  backButtonText: {
    fontSize: fp(18),
    color: colors.textLight,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: colors.textLight,
    marginTop: hp(25),
    marginRight: wp(15),
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: wp(15),
  },

  scoreBar: {
    backgroundColor: colors.bgWhite,
    flexDirection: 'row-reverse',
    paddingVertical: hp(8),
    paddingHorizontal: wp(20),
    borderBottomWidth: 1,
    borderBottomColor: GOLD_LIGHT,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: FONT_SIZES.md,
    color: colors.textSecondary,
  },
  scoreDivider: {
    width: 1,
    backgroundColor: GOLD,
    marginHorizontal: wp(16),
  },

  mainContent: {
    flex: 1,
    padding: SPACING.sm,
  },

  questionInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: hp(8),
    gap: wp(10),
  },
  questionBadge: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(20),
    backgroundColor: GOLD,
    borderWidth: 1,
    borderColor: GOLD,
    marginRight: 10,
  },
  questionNumber: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: colors.textLight,
  },
  questionTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahName: {
    fontSize: FONT_SIZES.surahName,
    fontWeight: '600',
    color: colors.primary,
  },
  instructionText: {
    fontSize: FONT_SIZES.sm,
    color: colors.textSecondary,
  },

  progressBar: {
    backgroundColor: colors.bgWhite,
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    borderRadius: RADIUS.md,
    marginBottom: hp(8),
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    alignSelf: 'center',
  },
  progressText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },

  bismillahBox: {
    backgroundColor: colors.bgWhite,
    padding: hp(8),
    borderRadius: RADIUS.md,
    marginBottom: hp(8),
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    marginRight: 10,
    marginLeft: 10,
  },
  bismillah: {
    fontSize: FONT_SIZES.lg,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },

  verseCardContainer: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  verseCard: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: RADIUS.xl,
    paddingVertical: hp(12),
    paddingHorizontal: wp(16),
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: hp(3) },
    shadowOpacity: 0.15,
    shadowRadius: wp(6),
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.secondary,
    marginBottom: 20,
  },
  verseOrnament: {
    width: wp(50),
    height: 2,
    backgroundColor: GOLD,
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: hp(6),
  },
  verseScrollView: {
    flex: 1,
  },
  verseScrollContent: {
    paddingVertical: hp(6),
    justifyContent: 'center',
    flexGrow: 1,
  },
  verseText: {
    fontSize: FONT_SIZES.verse, 
    lineHeight: 40, 
    textAlign: 'right',
    color: colors.textPrimary,
    writingDirection: 'rtl',
    fontFamily: 'ScheherazadeNew_400Regular',  
    includeFontPadding: false,
    marginRight: 10,
  },
  verseMetadata: {
    marginTop: hp(6),
    paddingTop: hp(6),
    borderTopWidth: 1,
    borderTopColor: GOLD_LIGHT,
  },
  metadataText: {
    fontSize: FONT_SIZES.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  controlsContainer: {
    backgroundColor: colors.bgWhite,
    padding: SPACING.sm,
    borderTopWidth: 2,
    borderTopColor: GOLD_LIGHT,
    gap: hp(8),
    padding: 15,
    height: 160,
  },
  controlsRow: {
    flexDirection: 'row-reverse',
    gap: wp(10),
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.bgLight,
    paddingVertical: hp(12), 
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  controlButtonTextDisabled: {
    color: colors.textSecondary,
  },
  quitButton: {
    backgroundColor: colors.bgLight,
    paddingVertical: hp(12), 
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: colors.error,
  },
  quitButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
  },

  mainButton: {
    flex: 1, 
    paddingVertical: hp(12), 
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    borderColor: colors.primary, 
  },
  mainButtonSuccess: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  mainButtonError: {
    backgroundColor: GOLD_LIGHT,
    shadowColor: colors.secondary,
  },
  mainButtonText: {
    fontSize: FONT_SIZES.buttonText,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: colors.bgWhite,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: wp(360),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(6) },
    shadowOpacity: 0.3,
    shadowRadius: wp(12),
    elevation: 10,
    borderTopWidth: 3,
    borderTopColor: GOLD,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: hp(16),
  },
  modalText: {
    fontSize: FONT_SIZES.md,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: hp(24),
    lineHeight: fp(26),
  },
  modalButtons: {
    gap: hp(10),
  },
  modalButton: {
    paddingVertical: hp(14),
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.bgLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: colors.textLight,
  },
  modalButtonTextSecondary: {
    color: colors.primary,
  },
});

export default CustomTestScreen;