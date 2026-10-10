import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useQuran } from '../../context/QuranContext';
import { HIZB_OPTIONS } from '../../constants/quranOptions';
import useTestSetupForm from '../../hooks/useTestSetupForm';
import { getHizbRangeInfo } from '../../utils/quranInfo';

const useHizbSelection = (navigation) => {
  const { rawData } = useQuran();
  const form = useTestSetupForm();
  const [selectedHizb, setSelectedHizb] = useState(null);

  const selectedHizbOption = HIZB_OPTIONS.find(o => o.value === selectedHizb) || null;

  const hizbInfo = useMemo(
    () => (selectedHizb ? getHizbRangeInfo(rawData, selectedHizb) : null),
    [selectedHizb, rawData]
  );

  const infoRows = hizbInfo
    ? [
        { label: 'الصفحات:', value: `${hizbInfo.startPage} - ${hizbInfo.endPage} (${hizbInfo.totalPages} صفحة)` },
        { label: 'السور:', value: hizbInfo.surahs.map(s => s.name).join('، ') || 'غير محدد' },
        { label: 'عدد الآيات:', value: `${hizbInfo.totalVerses} آية` },
      ]
    : [];

  const isButtonDisabled = !selectedHizb || form.isCountMissing;
  const disabledLabel = form.getDisabledLabel('اختر الحزب');

  const handleStartTest = () => {
    if (!selectedHizb) {
      Alert.alert('تنبيه', 'الرجاء اختيار حزب');
      return;
    }
    if (!form.validateQuestionCount()) return;

    navigation.navigate('Duaa', {
      testType: 'Hizb',
      hizbNumber: selectedHizb,
      ...form.getCommonParams(),
    });
  };

  return {
    form,
    hizbOptions: HIZB_OPTIONS,
    selectedHizb,
    setSelectedHizb,
    selectedHizbOption,
    infoRows,
    isButtonDisabled,
    disabledLabel,
    handleStartTest,
    goBack: () => navigation.goBack(),
  };
};

export default useHizbSelection;
