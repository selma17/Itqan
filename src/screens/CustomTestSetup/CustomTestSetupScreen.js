import React from 'react';
import BottomSheetSelect from '../../components/BottomSheetSelect';
import SelectionScreenLayout from '../../components/SelectionScreenLayout';
import SectionCard from '../../components/SectionCard';
import RadioOptionGroup from '../../components/RadioOptionGroup';
import SelectedBadges from '../../components/SelectedBadges';
import QuestionOrderSection from '../../components/QuestionOrderSection';
import NumberInputSection from '../../components/NumberInputSection';
import QuestionCountSection from '../../components/QuestionCountSection';
import ShowSurahNameSection from '../../components/ShowSurahNameSection';
import StartButton from '../../components/StartButton';
import { SURAH_OPTIONS, HIZB_OPTIONS } from '../../constants/quranOptions';
import PageRangesInput from './PageRangesInput';
import useCustomTestSetup from './useCustomTestSetup';

const SOURCE_TYPE_OPTIONS = [
  { value: 'surahs', label: 'سور' },
  { value: 'pages', label: 'نطاق صفحات' },
  { value: 'hizbs', label: 'أحزاب' },
];

const MODE_OPTIONS = [
  { value: 'sequential', label: 'متسلسل (حسب ترتيب المصحف)' },
  { value: 'random', label: 'عشوائي (بدون ترتيب)' },
];

const CustomTestSetupScreen = ({ navigation, route }) => {
  const setup = useCustomTestSetup(navigation, route);
  const { form, sourceType } = setup;

  return (
    <SelectionScreenLayout
      title="أنشئ اختبارك الخاص "
      onBack={setup.goBack}
      headerProps={{ accent: true, backIcon: '←' }}>

      <SectionCard title="مصدر الأسئلة">
        <RadioOptionGroup options={SOURCE_TYPE_OPTIONS} value={sourceType} onChange={setup.setSourceType} />
      </SectionCard>

      {sourceType === 'surahs' && (
        <SectionCard>
          <BottomSheetSelect
            multiple
            label="السور"
            placeholder="اختر السور"
            title="اختر السور"
            options={SURAH_OPTIONS}
            value={setup.selectedSurahs}
            onChange={setup.setSelectedSurahs}
          />
          <SelectedBadges items={setup.selectedSurahBadges} onRemove={setup.removeSurah} />
        </SectionCard>
      )}

      {sourceType === 'pages' && (
        <SectionCard>
          <PageRangesInput
            ranges={setup.pageRanges}
            onChange={setup.changePageRange}
            onAdd={setup.addPageRange}
            onRemove={setup.removePageRange}
          />
        </SectionCard>
      )}

      {sourceType === 'hizbs' && (
        <SectionCard>
          <BottomSheetSelect
            multiple
            label="الأحزاب"
            placeholder="اختر الأحزاب"
            title="اختر الأحزاب"
            options={HIZB_OPTIONS}
            value={setup.selectedHizbs}
            onChange={setup.setSelectedHizbs}
          />
          <SelectedBadges items={setup.selectedHizbBadges} onRemove={setup.removeHizb} />
        </SectionCard>
      )}

      <QuestionCountSection value={form.questionCount} onChange={form.setQuestionCount} />

      <QuestionOrderSection mode={form.mode} onChange={form.selectMode} options={MODE_OPTIONS} />

      <NumberInputSection
        title="عدد الآيات للقراءة"
        value={setup.versesToRead}
        onChange={setup.setVersesToRead}
        onFocus={setup.checkVersesToRead}
        placeholder="مثال: 3"
      />

      <ShowSurahNameSection value={form.showSurahName} onChange={form.setShowSurahName} />

      <StartButton onPress={setup.validateAndStart} />
    </SelectionScreenLayout>
  );
};

export default CustomTestSetupScreen;
