import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useQuran } from '../../context/QuranContext';
import useTestSetupForm from '../../hooks/useTestSetupForm';
import { getHizbRangeInfo } from '../../utils/quranInfo';
import { PARTS } from './partsConfig';

const useGeneralPartsSelection = (navigation) => {
  const { rawData } = useQuran();
  const form = useTestSetupForm();
  const [selectedCategory, setSelectedCategory] = useState('quarters');
  const [selectedPartId, setSelectedPartId] = useState(null);

  const currentParts = PARTS[selectedCategory];
  const partOptions = currentParts.map(part => ({ value: String(part.id), label: part.label }));
  const selectedPart = currentParts.find(p => String(p.id) === selectedPartId) || null;

  const partInfo = useMemo(
    () => (selectedPart ? getHizbRangeInfo(rawData, selectedPart.hizbFrom, selectedPart.hizbTo) : null),
    [selectedPart, rawData]
  );

  const infoRows = partInfo
    ? [
        { label: 'الصفحات:', value: `${partInfo.startPage} - ${partInfo.endPage} (${partInfo.totalPages} صفحة)` },
        { label: 'عدد الآيات:', value: `${partInfo.totalVerses} آية` },
        { label: 'السور:', value: partInfo.surahs.map(s => s.name).join('، ') },
      ]
    : [];

  // Changer de catégorie réinitialise la partie sélectionnée.
  const changeCategory = (category) => {
    setSelectedCategory(category);
    setSelectedPartId(null);
  };

  const isButtonDisabled = !selectedPart || form.isCountMissing;
  const disabledLabel = !selectedPart ? 'اختر جزءاً أولاً' : 'حدد عدد الأسئلة أولاً';

  const handleStartTest = () => {
    if (!selectedPart) {
      Alert.alert('تنبيه', 'الرجاء اختيار جزء من القرآن');
      return;
    }
    if (!form.validateQuestionCount()) return;

    navigation.navigate('Duaa', {
      testType: 'GeneralPart',
      partLabel: selectedPart.label,
      hizbFrom: selectedPart.hizbFrom,
      hizbTo: selectedPart.hizbTo,
      ...form.getCommonParams(),
    });
  };

  return {
    form,
    selectedCategory,
    changeCategory,
    partOptions,
    selectedPart,
    selectedPartId,
    setSelectedPartId,
    infoRows,
    isButtonDisabled,
    disabledLabel,
    handleStartTest,
    goBack: () => navigation.goBack(),
  };
};

export default useGeneralPartsSelection;
