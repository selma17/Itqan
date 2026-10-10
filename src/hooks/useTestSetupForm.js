import { useState } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { QUESTION_ORDER } from '../constants/testModes';
import { isQuestionCountValid, parseQuestionCount } from '../utils/testSetup';

const COUNT_REQUIRED_MESSAGE = 'يجب تحديد عدد الأسئلة';

/**
 * État + validation communs aux écrans de configuration de test
 * (ordre des questions, nombre de questions, affichage du nom de sourate).
 */
const useTestSetupForm = ({ defaultShowSurahName = true, defaultQuestionCount = '' } = {}) => {
  const [mode, setMode] = useState(QUESTION_ORDER.RANDOM);
  const [questionCount, setQuestionCount] = useState(defaultQuestionCount);
  const [showSurahName, setShowSurahName] = useState(defaultShowSurahName);

  const selectMode = (value) => {
    setMode(value);
    if (value === QUESTION_ORDER.SEQUENTIAL && Platform.OS === 'android') {
      ToastAndroid.show(COUNT_REQUIRED_MESSAGE, ToastAndroid.SHORT);
    }
  };

  const isCountMissing = mode === QUESTION_ORDER.SEQUENTIAL && !isQuestionCountValid(questionCount);

  // Retourne true si le nombre de questions est valide pour le mode choisi.
  const validateQuestionCount = () => {
    if (isCountMissing) {
      Alert.alert('تنبيه', 'يجب تحديد عدد الأسئلة عند اختيار الوضع المتسلسل');
      return false;
    }
    return true;
  };

  const getDisabledLabel = (selectionLabel) =>
    isCountMissing ? 'حدد عدد الأسئلة' : selectionLabel;

  // Paramètres communs à passer à l'écran suivant.
  const getCommonParams = () => ({
    selectionMode: mode,
    questionCount: parseQuestionCount(questionCount),
    showSurahName,
  });

  return {
    mode,
    selectMode,
    questionCount,
    setQuestionCount,
    showSurahName,
    setShowSurahName,
    isCountMissing,
    validateQuestionCount,
    getDisabledLabel,
    getCommonParams,
  };
};

export default useTestSetupForm;
