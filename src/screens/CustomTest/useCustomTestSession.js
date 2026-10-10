import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useQuran } from '../../context/QuranContext';
import useElapsedTimer from '../../hooks/useElapsedTimer';
import useVerseFontSize from '../../hooks/useVerseFontSize';
import { buildCustomQuestions } from '../../utils/questionGenerator';
import { getCustomTestVerses } from '../../utils/verses';

const useCustomTestSession = (navigation, route) => {
  const { quranData } = useQuran();
  const params = route.params;
  const {
    sourceType, selectedSurahs, pageRanges, selectedHizbs,
    questionCount, mode, versesToRead, showSurahName = true,
  } = params;

  const { elapsed, stop: stopTimer } = useElapsedTimer();
  const verseFontSize = useVerseFontSize();

  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [versesReadCount, setVersesReadCount] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuitModal, setShowQuitModal] = useState(false);

  // Génération des questions au démarrage
  useEffect(() => {
    if (!quranData) return;

    const abort = (message) => {
      Alert.alert('خطأ', message);
      navigation.goBack();
    };

    const allVerses = getCustomTestVerses(quranData, params);
    if (allVerses.length === 0) return abort('لم يتم العثور على آيات');

    const questions = buildCustomQuestions(allVerses, { count: questionCount, mode, versesToRead });
    if (questions.length === 0) return abort('لا توجد آيات كافية لإنشاء الاختبار بهذه المعايير');

    setAllQuestions(questions);
    setCurrentVerse(questions[0]);
    setLoading(false);
  }, [quranData]);

  const isCompleted = versesReadCount >= versesToRead;
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;

  const nextVerse = () => {
    if (!currentVerse) return;

    if (isCompleted) {
      Alert.alert('تنبيه', 'لقد أنهيت قراءة الآيات المطلوبة. انتقل للسؤال التالي');
      return;
    }

    const verses = quranData.versesDetailed[currentVerse.surahNumber];
    if (!verses) return;

    const currentIndex = verses.findIndex(v => v.number === currentVerse.verseNumber);
    if (currentIndex >= verses.length - 1) {
      Alert.alert('تنبيه', 'هذه هي الآية الأخيرة في السورة');
      return;
    }

    const next = verses[currentIndex + 1];
    setCurrentVerse({
      surahNumber: currentVerse.surahNumber,
      surahName: currentVerse.surahName,
      verseNumber: next.number,
      text: next.text,
      page: next.page,
      juz: next.juz,
    });
    setVersesReadCount(versesReadCount + 1);
  };

  // Les questions restantes comptent comme des erreurs.
  const finishTest = (finalScore, finalErrors) => {
    stopTimer();
    const remaining = allQuestions.length - (currentQuestionIndex + 1);

    navigation.navigate('CustomResults', {
      score: finalScore,
      errors: finalErrors + remaining,
      totalQuestions: allQuestions.length,
      duration: elapsed,
      sourceType,
      selectedSurahs,
      pageRanges,
      selectedHizbs,
      mode,
      versesToRead,
      showSurahName,
    });
  };

  const submitQuestion = (isCorrect) => {
    const newScore = score + (isCorrect ? 1 : 0);
    const newErrors = errors + (isCorrect ? 0 : 1);
    setScore(newScore);
    setErrors(newErrors);

    if (isLastQuestion) {
      finishTest(newScore, newErrors);
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setCurrentVerse(allQuestions[nextIndex]);
    setVersesReadCount(0);
  };

  const nextQuestion = () => {
    if (isCompleted) {
      submitQuestion(true);
      return;
    }

    Alert.alert('تأكيد', 'هل نسيت هذا الموضع ؟ ', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'نعم', style: 'destructive', onPress: () => submitQuestion(false) },
    ]);
  };

  // La question en cours est évaluée selon l'avancement de la lecture.
  const quit = () => {
    setShowQuitModal(false);
    finishTest(score + (isCompleted ? 1 : 0), errors + (isCompleted ? 0 : 1));
  };

  const getMainButtonLabel = () => {
    const base = isLastQuestion ? 'إنهاء الاختبار' : 'السؤال التالي';
    return isCompleted ? `${base} ✓` : `${base} (خطأ)`;
  };

  return {
    ready: !!quranData,
    loading,
    currentVerse,
    showSurahName,
    verseFontSize,
    score,
    errors,
    elapsed,
    versesToRead,
    versesReadCount,
    isCompleted,
    questionProgress: `${currentQuestionIndex + 1}/${allQuestions.length}`,
    mainButtonLabel: getMainButtonLabel(),
    showQuitModal,
    setShowQuitModal,
    nextVerse,
    nextQuestion,
    quit,
  };
};

export default useCustomTestSession;
