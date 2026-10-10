import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useQuran } from '../../context/QuranContext';
import useVerseFontSize from '../../hooks/useVerseFontSize';
import { buildQuestions } from '../../utils/questionGenerator';
import { pickRandom } from '../../utils/random';
import { getAdjacentVerse, getTestVerses, getVerseKey } from '../../utils/verses';

const useTestSession = (navigation, route) => {
  const { quranData } = useQuran();
  const params = route.params;
  const { questionCount, selectionMode = 'random', showSurahName = true } = params;
  const hasDefinedQuestionCount = questionCount > 0;

  const verseFontSize = useVerseFontSize();

  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  // Versets déjà posés (mode sans nombre de questions défini) pour éviter les répétitions.
  const usedVersesRef = useRef(new Set());
  // Les questions ne sont générées qu'une fois (un rechargement de riwaya ne doit pas les réinitialiser).
  const generatedRef = useRef(false);

  const testVerses = useMemo(
    () => (quranData ? getTestVerses(quranData, params) : []),
    [quranData, params]
  );

  // Génération des questions au démarrage
  useEffect(() => {
    if (!quranData || generatedRef.current) return;

    try {
      if (testVerses.length === 0) {
        Alert.alert('خطأ', 'لم يتم العثور على آيات');
        navigation.goBack();
        return;
      }

      if (hasDefinedQuestionCount) {
        const questions = buildQuestions(testVerses, { count: questionCount, mode: selectionMode });
        setAllQuestions(questions);
        if (questions.length > 0) setCurrentVerse(questions[0]);
      } else {
        const first = pickRandom(testVerses);
        setCurrentVerse(first);
        usedVersesRef.current = new Set([getVerseKey(first)]);
      }
      generatedRef.current = true;
      setLoading(false);
    } catch (error) {
      console.error('Erreur génération des questions:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الأسئلة');
      setLoading(false);
    }
  }, [quranData, testVerses, hasDefinedQuestionCount, questionCount, selectionMode]);

  const loadRandomVerse = () => {
    const used = usedVersesRef.current;
    const available = testVerses.filter(v => !used.has(getVerseKey(v)));
    const pool = available.length > 0 ? available : testVerses;
    const verse = pickRandom(pool);

    if (!verse) {
      Alert.alert('خطأ', 'لم يتم العثور على آيات');
      return;
    }

    // Quand tous les versets ont été posés, on repart de zéro.
    usedVersesRef.current = available.length > 0
      ? new Set(used).add(getVerseKey(verse))
      : new Set([getVerseKey(verse)]);
    setCurrentVerse(verse);
  };

  const goToResults = (finalScore, finalErrors) => {
    navigation.navigate('Results', {
      score: finalScore,
      errors: finalErrors,
      ...params,
      showSurahName,
    });
  };

  // Navigation entre versets consécutifs
  const moveVerse = (direction) => {
    if (!currentVerse) return;
    const { verse, boundary } = getAdjacentVerse(testVerses, currentVerse, direction);
    if (verse) {
      setCurrentVerse(verse);
    } else if (boundary) {
      Alert.alert('تنبيه', direction < 0 ? 'هذه هي أول آية في نطاق الاختبار' : 'هذه هي آخر آية في نطاق الاختبار');
    }
  };

  // Enregistre la réponse puis passe à la question suivante (ou aux résultats).
  const answer = (isCorrect) => {
    setShowAnswerModal(false);
    const newScore = score + (isCorrect ? 1 : 0);
    const newErrors = errors + (isCorrect ? 0 : 1);
    setScore(newScore);
    setErrors(newErrors);

    if (!hasDefinedQuestionCount) {
      loadRandomVerse();
      setQuestionNumber(questionNumber + 1);
      return;
    }

    if (currentQuestionIndex < allQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentVerse(allQuestions[nextIndex]);
      setQuestionNumber(questionNumber + 1);
    } else {
      goToResults(newScore, newErrors);
    }
  };

  // Les questions non répondues comptent comme des erreurs quand on quitte.
  const quit = () => {
    setShowQuitModal(false);
    const remaining = hasDefinedQuestionCount ? allQuestions.length - (questionNumber - 1) : 0;
    goToResults(score, errors + remaining);
  };

  return {
    ready: !!quranData,
    loading,
    currentVerse,
    hasDefinedQuestionCount,
    showSurahName,
    verseFontSize,
    score,
    errors,
    questionNumber,
    questionProgress: `${currentQuestionIndex + 1}/${allQuestions.length}`,
    showQuitModal,
    setShowQuitModal,
    showAnswerModal,
    setShowAnswerModal,
    previousVerse: () => moveVerse(-1),
    nextVerse: () => moveVerse(1),
    answerCorrect: () => answer(true),
    answerWrong: () => answer(false),
    quit,
    backToMain: () => navigation.navigate('Main'),
  };
};

export default useTestSession;
