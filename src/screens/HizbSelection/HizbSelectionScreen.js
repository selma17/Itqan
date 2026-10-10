import React from 'react';
import BottomSheetSelect from '../../components/BottomSheetSelect';
import SelectionScreenLayout from '../../components/SelectionScreenLayout';
import SectionCard from '../../components/SectionCard';
import QuestionOrderSection from '../../components/QuestionOrderSection';
import QuestionCountSection from '../../components/QuestionCountSection';
import ShowSurahNameSection from '../../components/ShowSurahNameSection';
import InfoCard from '../../components/InfoCard';
import StartButton from '../../components/StartButton';
import useHizbSelection from './useHizbSelection';

const HizbSelectionScreen = ({ navigation }) => {
  const {
    form, hizbOptions, selectedHizb, setSelectedHizb, selectedHizbOption,
    infoRows, isButtonDisabled, disabledLabel, handleStartTest, goBack,
  } = useHizbSelection(navigation);

  return (
    <SelectionScreenLayout title="مواضع من حزب " onBack={goBack}>
      <SectionCard>
        <BottomSheetSelect
          label="الحزب"
          placeholder="اختر الحزب"
          title="اختر الحزب"
          options={hizbOptions}
          value={selectedHizb}
          onChange={setSelectedHizb}
        />
      </SectionCard>

      <QuestionOrderSection mode={form.mode} onChange={form.selectMode} />
      <QuestionCountSection value={form.questionCount} onChange={form.setQuestionCount} />

      {selectedHizbOption && <InfoCard title={selectedHizbOption.label} rows={infoRows} />}

      <ShowSurahNameSection value={form.showSurahName} onChange={form.setShowSurahName} />

      <StartButton
        onPress={handleStartTest}
        disabled={isButtonDisabled}
        disabledLabel={disabledLabel}
      />
    </SelectionScreenLayout>
  );
};

export default HizbSelectionScreen;
