import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import quranData from '../../data/quranData';
import { SURAH_OPTIONS } from '../../constants/quranOptions';
import useTestSetupForm from '../../hooks/useTestSetupForm';

const useSurahSelection = (navigation) => {
  const form = useTestSetupForm();
  const [selectedSurah, setSelectedSurah] = useState(null);

  const selectedSurahData = useMemo(
    () => (selectedSurah ? quranData.surahs.find(s => s.number === selectedSurah) : null),
    [selectedSurah]
  );

  const isButtonDisabled = !selectedSurah || form.isCountMissing;
  const disabledLabel = form.getDisabledLabel('اختر السورة');

  const handleStartTest = () => {
    if (!selectedSurah) {
      Alert.alert('تنبيه', 'الرجاء اختيار سورة');
      return;
    }
    if (!form.validateQuestionCount()) return;

    navigation.navigate('Duaa', {
      testType: 'surah',
      surahNumber: selectedSurah,
      ...form.getCommonParams(),
    });
  };

  return {
    form,
    surahOptions: SURAH_OPTIONS,
    selectedSurahData,
    setSelectedSurah,
    isButtonDisabled,
    disabledLabel,
    handleStartTest,
    goBack: () => navigation.goBack(),
  };
};

export default useSurahSelection;
