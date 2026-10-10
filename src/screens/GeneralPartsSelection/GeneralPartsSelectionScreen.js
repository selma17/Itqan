import React from 'react';
import { View } from 'react-native';
import BottomSheetSelect from '../../components/BottomSheetSelect';
import SelectionScreenLayout from '../../components/SelectionScreenLayout';
import SectionCard from '../../components/SectionCard';
import QuestionOrderSection from '../../components/QuestionOrderSection';
import QuestionCountSection from '../../components/QuestionCountSection';
import ShowSurahNameSection from '../../components/ShowSurahNameSection';
import InfoCard from '../../components/InfoCard';
import StartButton from '../../components/StartButton';
import useGeneralPartsSelection from './useGeneralPartsSelection';
import { CATEGORY_OPTIONS } from './partsConfig';
import styles from './styles';

const GeneralPartsSelectionScreen = ({ navigation }) => {
  const {
    form, selectedCategory, changeCategory, partOptions, selectedPart,
    selectedPartId, setSelectedPartId, infoRows,
    isButtonDisabled, disabledLabel, handleStartTest, goBack,
  } = useGeneralPartsSelection(navigation);

  return (
    <SelectionScreenLayout title="مواضع من أجزاء" onBack={goBack}>
      <SectionCard>
        <View style={styles.fieldGap}>
          <BottomSheetSelect
            label="نوع التقسيم"
            placeholder="اختر نوع التقسيم"
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={changeCategory}
          />
          <BottomSheetSelect
            label="الجزء"
            placeholder="اختر الجزء"
            options={partOptions}
            value={selectedPartId}
            onChange={setSelectedPartId}
          />
        </View>
      </SectionCard>

      {selectedPart && infoRows.length > 0 && <InfoCard title={selectedPart.label} rows={infoRows} />}

      <QuestionOrderSection mode={form.mode} onChange={form.selectMode} />
      <QuestionCountSection value={form.questionCount} onChange={form.setQuestionCount} />
      <ShowSurahNameSection value={form.showSurahName} onChange={form.setShowSurahName} />

      <StartButton
        onPress={handleStartTest}
        disabled={isButtonDisabled}
        disabledLabel={disabledLabel}
      />
    </SelectionScreenLayout>
  );
};

export default GeneralPartsSelectionScreen;
