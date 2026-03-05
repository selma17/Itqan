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
  Modal,
  ActivityIndicator,
} from 'react-native';
import colors from '../styles/colors';
import quranData from '../data/quranData';
import { wp, hp, fp, SPACING, FONT_SIZES, RADIUS } from '../utils/responsive';
import { useFonts, ScheherazadeNew_400Regular } from '@expo-google-fonts/scheherazade-new';

const TestScreen = ({ navigation, route }) => {
  let [fontsLoaded] = useFonts({ ScheherazadeNew_400Regular,});
  const [fontLoaded, setFontLoaded] = useState(false);
  const { 
    testType, 
    surahNumber, 
    pageFrom, 
    pageTo, 
    hizbNumber,
    questionCount,
    selectionMode = 'random'
  } = route.params;

  const hasDefinedQuestionCount = questionCount && questionCount > 0;

  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usedVerses, setUsedVerses] = useState(new Set());
  useEffect(() => {
    
    const generateQuestions = () => {
      try {
        let allVerses = [];
        
        if (testType === 'surah') {
          const surahVerses = quranData.versesDetailed[surahNumber] || [];
          allVerses = surahVerses.map(v => ({
            surahNumber: surahNumber,
            surahName: quranData.getSurahName(surahNumber),
            verseNumber: v.number,
            text: v.text,
            page: v.page,
            juz: v.juz,
          }));
        } else if (testType === 'pages') {
          for (let page = pageFrom; page <= pageTo; page++) {
            const pageVerses = quranData.getVersesByPage(page) || [];
            pageVerses.forEach(v => {
              allVerses.push({
                surahNumber: v.surahNumber,
                surahName: v.surahName,
                verseNumber: v.verseNumber,
                text: v.text,
                page: v.page || page,
                juz: v.juz,
              });
            });
          }
        } else if (testType === 'Hizb') {
          const hizbVerses = quranData.getVersesByHizb(hizbNumber) || [];
          hizbVerses.forEach(v => {
            allVerses.push({
              surahNumber: v.surahNumber,
              surahName: v.surahName,
              verseNumber: v.verseNumber,
              text: v.text,
              page: v.page,
              juz: v.juz,
            });
          });
        }

        if (allVerses.length === 0) {
          Alert.alert('خطأ', 'لم يتم العثور على آيات');
          navigation.goBack();
          return;
        }

        let questions = [];

        if (hasDefinedQuestionCount) {
          if (selectionMode === 'sequential') {
            allVerses.sort((a, b) => {
              if (a.surahNumber !== b.surahNumber) {
                return a.surahNumber - b.surahNumber;
              }
              return a.verseNumber - b.verseNumber;
            });

            const numQuestions = Math.min(questionCount, allVerses.length);
            const blockSize = Math.floor(allVerses.length / numQuestions);
            
            questions = [];
            
            for (let i = 0; i < numQuestions; i++) {
              const blockStart = i * blockSize;
              const blockEnd = (i === numQuestions - 1) 
                ? allVerses.length
                : (i + 1) * blockSize;
              
              const randomIndexInBlock = blockStart + Math.floor(Math.random() * (blockEnd - blockStart));
              
              if (randomIndexInBlock < allVerses.length) {
                questions.push(allVerses[randomIndexInBlock]);
              }
            }
          } else {
            const shuffled = [...allVerses];
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
        } else {
          setAllQuestions(allVerses);
          
          if (allVerses.length > 0) {
            const randomIndex = Math.floor(Math.random() * allVerses.length);
            setCurrentVerse(allVerses[randomIndex]);
            setUsedVerses(new Set([`${allVerses[randomIndex].surahNumber}-${allVerses[randomIndex].verseNumber}`]));
          }
        }

        setLoading(false);
      } catch (error) {
        Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الأسئلة');
        setLoading(false);
      }
    };

    generateQuestions();
  }, [testType, surahNumber, pageFrom, pageTo, hizbNumber, questionCount, selectionMode]);

  const loadRandomVerse = React.useCallback(() => {
    if (hasDefinedQuestionCount) return;

    setLoading(true);
    
    try {
      let verses = [];
      
      if (testType === 'surah') {
        const surahVerses = quranData.versesDetailed[surahNumber] || [];
        verses = surahVerses.map(v => ({
          surahNumber: surahNumber,
          surahName: quranData.getSurahName(surahNumber),
          verseNumber: v.number,
          text: v.text,
          page: v.page,
          juz: v.juz,
        }));
      } else if (testType === 'pages') {
        for (let page = pageFrom; page <= pageTo; page++) {
          const pageVerses = quranData.getVersesByPage(page) || [];
          pageVerses.forEach(v => {
            verses.push({
              surahNumber: v.surahNumber,
              surahName: v.surahName,
              verseNumber: v.verseNumber,
              text: v.text,
              page: v.page || page,
              juz: v.juz,
            });
          });
        }
      } else if (testType === 'Hizb') {
        const hizbVerses = quranData.getVersesByHizb(hizbNumber) || [];
        hizbVerses.forEach(v => {
          verses.push({
            surahNumber: v.surahNumber,
            surahName: v.surahName,
            verseNumber: v.verseNumber,
            text: v.text,
            page: v.page,
            juz: v.juz,
          });
        });
      }

      setUsedVerses(currentUsed => {
        const availableVerses = verses.filter(v => {
          const verseKey = `${v.surahNumber}-${v.verseNumber}`;
          return !currentUsed.has(verseKey);
        });

        let versesToChooseFrom = availableVerses.length > 0 ? availableVerses : verses;
        let shouldReset = availableVerses.length === 0;

        const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
          ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
          : Math.random();
        
        const randomIndex = Math.floor(randomValue * versesToChooseFrom.length);
        const selectedVerse = versesToChooseFrom[randomIndex];

        if (selectedVerse) {
          const verseKey = `${selectedVerse.surahNumber}-${selectedVerse.verseNumber}`;
          
          setCurrentVerse(selectedVerse);

          if (shouldReset) {
            return new Set([verseKey]);
          } else {
            const newSet = new Set(currentUsed);
            newSet.add(verseKey);
            return newSet;
          }
        } else {
          Alert.alert('خطأ', 'لم يتم العثور على آيات');
          return currentUsed;
        }
      });
      
      setLoading(false);
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الآية');
      setLoading(false);
    }
  }, [testType, surahNumber, pageFrom, pageTo, hizbNumber, hasDefinedQuestionCount]);

  const handlePreviousVerse = () => {
    if (!currentVerse) return;

    // Récupérer tous les versets disponibles dans le range du test
    let allTestVerses = [];
    if (testType === 'pages') {
      for (let page = pageFrom; page <= pageTo; page++) {
        const pageVerses = quranData.getVersesByPage(page) || [];
        allTestVerses = allTestVerses.concat(pageVerses);
      }
    } else if (testType === 'Hizb') {
      allTestVerses = quranData.getVersesByHizb(hizbNumber) || [];
    } else if (testType === 'surah') {
      const surahVerses = quranData.versesDetailed[currentVerse.surahNumber] || [];
      allTestVerses = surahVerses.map(v => ({
        surahNumber: currentVerse.surahNumber,
        surahName: currentVerse.surahName,
        verseNumber: v.number,
        text: v.text,
        page: v.page,
        juz: v.juz,
      }));
    }

    // Trouver le verset actuel dans le range
    const currentIndexInRange = allTestVerses.findIndex(v => 
      v.surahNumber === currentVerse.surahNumber && v.verseNumber === currentVerse.verseNumber
    );

    if (currentIndexInRange > 0) {
      const prevVerse = allTestVerses[currentIndexInRange - 1];
      
      // Vérifier si c'est vraiment le verset précédent
      if (prevVerse.surahNumber === currentVerse.surahNumber) {
        // Même sourate : vérifier aya_no - 1
        if (prevVerse.verseNumber === currentVerse.verseNumber - 1) {
          setCurrentVerse(prevVerse);
        } 
      } else if (prevVerse.surahNumber === currentVerse.surahNumber - 1 && currentVerse.verseNumber === 1) {
        // Fin de sourate précédente (verset actuel est le premier de sa sourate)
        setCurrentVerse(prevVerse);
      } 
    } else {
      Alert.alert('تنبيه', 'هذه هي أول آية في نطاق الاختبار');
    }
  };

  const handleNextVerse = () => {
    if (!currentVerse) return;

    // Récupérer tous les versets disponibles dans le range du test
    let allTestVerses = [];
    if (testType === 'pages') {
      for (let page = pageFrom; page <= pageTo; page++) {
        const pageVerses = quranData.getVersesByPage(page) || [];
        allTestVerses = allTestVerses.concat(pageVerses);
      }
    } else if (testType === 'Hizb') {
      allTestVerses = quranData.getVersesByHizb(hizbNumber) || [];
    } else if (testType === 'surah') {
      const surahVerses = quranData.versesDetailed[currentVerse.surahNumber] || [];
      allTestVerses = surahVerses.map(v => ({
        surahNumber: currentVerse.surahNumber,
        surahName: currentVerse.surahName,
        verseNumber: v.number,
        text: v.text,
        page: v.page,
        juz: v.juz,
      }));
    }

    // Trouver le verset actuel dans le range
    const currentIndexInRange = allTestVerses.findIndex(v => 
      v.surahNumber === currentVerse.surahNumber && v.verseNumber === currentVerse.verseNumber
    );

    if (currentIndexInRange < allTestVerses.length - 1) {
      const nextVerse = allTestVerses[currentIndexInRange + 1];
      
      // Vérifier si c'est vraiment le verset suivant
      if (nextVerse.surahNumber === currentVerse.surahNumber) {
        // Même sourate : vérifier aya_no + 1
        if (nextVerse.verseNumber === currentVerse.verseNumber + 1) {
          setCurrentVerse(nextVerse);
        } 
      } else if (nextVerse.surahNumber === currentVerse.surahNumber + 1 && nextVerse.verseNumber === 1) {
        // Début de sourate suivante (verset actuel est le dernier de sa sourate)
        setCurrentVerse(nextVerse);
      } 
    } else {
      Alert.alert('تنبيه', 'هذه هي آخر آية في نطاق الاختبار');
    }
  };

  const handleNextQuestion = () => {
    if (hasDefinedQuestionCount) {
      if (currentQuestionIndex < allQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setCurrentVerse(allQuestions[nextIndex]);
        setQuestionNumber(questionNumber + 1);
      } else {
        navigation.navigate('Results', {
          score: score + 1,
          errors: errors,
          testType,
          surahNumber,
          pageFrom,
          pageTo,
          hizbNumber,
          questionCount,
          selectionMode,
        });
      }
    } else {
      loadRandomVerse();
      setQuestionNumber(questionNumber + 1);
    }
  };

  const handleWrongAnswer = () => {
    setErrors(errors + 1);
    
    if (hasDefinedQuestionCount) {
      if (currentQuestionIndex < allQuestions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setCurrentVerse(allQuestions[nextIndex]);
          setQuestionNumber(questionNumber + 1);
      } else {
        navigation.navigate('Results', {
          score: score,
          errors: errors + 1,
          testType,
          surahNumber,
          pageFrom,
          pageTo,
          hizbNumber,
          questionCount,
          selectionMode,
        });
      }
    } else {
      loadRandomVerse();
      setQuestionNumber(questionNumber + 1);
    }
  };

  const handleNewQuestionCorrect = () => {
    setShowNewQuestionModal(false);
    setScore(score + 1);
    loadRandomVerse();
    setQuestionNumber(questionNumber + 1);
  };

  const handleNewQuestionWrong = () => {
    setShowNewQuestionModal(false);
    setErrors(errors + 1);
    loadRandomVerse();
    setQuestionNumber(questionNumber + 1);
  };

  const handleNewQuestionClick = () => {
    setShowNewQuestionModal(true);
  };

  const handleQuit = () => {
    setShowQuitModal(false);
    
    if (hasDefinedQuestionCount) {
      const questionsAnswered = questionNumber - 1 ;
      const remainingQuestions = allQuestions.length - questionsAnswered;
      const finalErrors = errors + remainingQuestions;
      
      navigation.navigate('Results', {
        score: score,
        errors: finalErrors,
        testType,
        surahNumber,
        pageFrom,
        pageTo,
        hizbNumber,
        questionCount,
        selectionMode,
      });
    } else {
      navigation.navigate('Results', {
        score: score,
        errors: errors,
        testType,
        surahNumber,
        pageFrom,
        pageTo,
        hizbNumber,
        questionCount,
        selectionMode,
      });
    }
  };

  const handleBackToMain = () => {
    navigation.navigate('Main');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>جارٍ تحميل الأسئلة...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentVerse) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>لا توجد آيات متاحة</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToMain}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>اختبار القرآن الكريم</Text>
        </View>
      </View>

      <View style={styles.scoreBar}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>صحيح</Text>
        </View>
        
        <View style={styles.scoreDivider} />
        
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{errors}</Text>
          <Text style={styles.scoreLabel}>خطأ</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.questionInfo}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionNumber}>{questionNumber}</Text>
          </View>
          
          <View style={styles.questionTextContainer}>
            <Text style={styles.surahName}>سورة {currentVerse.surahName}</Text>
            <Text style={styles.instructionText}>
              اقرأ من قوله تعالى (آية {currentVerse.verseNumber}):
            </Text>
          </View>
        </View>

        <View style={styles.bismillahBox}>
          <Text style={styles.bismillah}>﷽</Text>
        </View>

        <View style={styles.verseCard}>
          <View style={styles.verseOrnament} />
          
          <ScrollView 
            style={styles.verseScrollView}
            contentContainerStyle={styles.verseScrollContent}
            showsVerticalScrollIndicator={true}
            indicatorStyle="default"
          >
            <Text style={styles.verseText}>
              {currentVerse.text}
            </Text>
          </ScrollView>
          
          <View style={styles.verseOrnament} />
          
          <View style={styles.verseMetadata}>
            <Text style={styles.metadataText}>
              {`الآية ${currentVerse.verseNumber} • الصفحة ${currentVerse.page || '-'} • الجزء ${currentVerse.juz || '-'}`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        {hasDefinedQuestionCount && (
          <View style={styles.questionCounter}>
            <Text style={styles.questionCounterText}>
              {`${currentQuestionIndex + 1}/${allQuestions.length}`}
            </Text>
          </View>
        )}

        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handlePreviousVerse}
          >
            <Text style={styles.controlButtonText}>السابقة</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleNextVerse}
          >
            <Text style={styles.controlButtonText}>التالية</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.newQuestionButton}
          onPress={handleNewQuestionClick}
        >
          <Text style={styles.newQuestionButtonText}>سؤال جديد</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quitButton}
          onPress={() => setShowQuitModal(true)}
        >
          <Text style={styles.quitButtonText}>إنهاء</Text>
        </TouchableOpacity>
      </View>

      {hasDefinedQuestionCount && (
        <Modal
          visible={showNewQuestionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowNewQuestionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>هل أجبت بشكل صحيح؟</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSuccess]}
                  onPress={() => {
                    setShowNewQuestionModal(false);
                    setScore(score + 1);
                    handleNextQuestion();
                  }}
                >
                  <Text style={styles.modalButtonText}>نعم</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonError]}
                  onPress={() => {
                    setShowNewQuestionModal(false);
                    if (currentQuestionIndex === allQuestions.length - 1) {
                      navigation.navigate('Results', {
                        score: score,
                        errors: errors + 1,
                        testType,
                        surahNumber,
                        pageFrom,
                        pageTo,
                        hizbNumber,
                        questionCount,
                        selectionMode,
                      });
                    } else {
                      handleWrongAnswer();
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>لا</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {!hasDefinedQuestionCount && (
        <Modal
          visible={showNewQuestionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowNewQuestionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>هل أجبت بشكل صحيح؟</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSuccess]}
                  onPress={handleNewQuestionCorrect}
                >
                  <Text style={styles.modalButtonText}>نعم</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonError]}
                  onPress={handleNewQuestionWrong}
                >
                  <Text style={styles.modalButtonText}>لا</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={showQuitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQuitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تأكيد الخروج</Text>
            <Text style={styles.modalText}>
              هل تريد إنهاء الاختبار؟
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setShowQuitModal(false)}
              >
                <Text style={styles.modalButtonText}>متابعة</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleQuit}
              >
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.1,
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
    fontWeight: '700',
    color: colors.textLight,
    marginTop: hp(25),
    marginRight: wp(15),
  },
  
  scoreBar: {
    backgroundColor: colors.bgWhite,
    flexDirection: 'row-reverse',
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
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
    backgroundColor: colors.secondary,
    marginHorizontal: wp(16),
  },
  
  mainContent: {
    flex: 1,
    padding: SPACING.md,
  },
  
  questionInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: hp(12),
    gap: wp(10),
  },
  questionBadge: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: FONT_SIZES.lg,
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
  
  bismillahBox: {
    backgroundColor: colors.bgWhite,
    padding: hp(12),
    borderRadius: RADIUS.md,
    marginBottom: hp(12),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bismillah: {
    fontSize: FONT_SIZES.lg,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  verseCard: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: RADIUS.xl,
    paddingVertical: hp(16),
    paddingHorizontal: wp(20),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(4) },
    shadowOpacity: 0.1,
    shadowRadius: wp(8),
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  verseOrnament: {
    width: wp(50),
    height: 2,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: hp(8),
  },
  verseScrollView: {
    flex: 1,
  },
  verseScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: hp(8),
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
    marginTop: hp(8),
    paddingTop: hp(8),
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metadataText: {
    fontSize: FONT_SIZES.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  controlsContainer: {
    backgroundColor: colors.bgWhite,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: hp(10),
  },
  questionCounter: {
    alignSelf: 'center',
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: wp(12),
    paddingVertical: hp(4),
    borderRadius: RADIUS.sm,
    marginBottom: hp(4),
  },
  questionCounterText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: '600',
    color: colors.primary,
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
    borderColor: colors.border,
  },
  controlButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  newQuestionButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(14),
    borderRadius: RADIUS.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.25,
    shadowRadius: wp(4),
    elevation: 3,
  },
  newQuestionButtonText: {
    fontSize: FONT_SIZES.buttonText,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: colors.bgLight,
    paddingVertical: hp(10),
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quitButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.textSecondary,
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
  modalButtonSuccess: {
    backgroundColor: colors.success,
  },
  modalButtonError: {
    backgroundColor: colors.error,
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

export default TestScreen;