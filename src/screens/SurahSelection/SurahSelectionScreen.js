import React from 'react';
import { View, Text } from 'react-native';
import BottomSheetSelect from '../../components/BottomSheetSelect';
import SelectionScreenLayout from '../../components/SelectionScreenLayout';
import SectionCard from '../../components/SectionCard';
import QuestionOrderSection from '../../components/QuestionOrderSection';
import QuestionCountSection from '../../components/QuestionCountSection';
import StartButton from '../../components/StartButton';
import useSurahSelection from './useSurahSelection';
import styles from './styles';

const SurahInfoCard = ({ surah }) => (
  <View style={styles.surahInfoCard}>
    <View style={styles.surahInfoHeader}>
      <View style={styles.surahNumberBadge}>
        <Text style={styles.surahNumberText}>{surah.number}</Text>
      </View>
      <View style={styles.surahNameContainer}>
        <Text style={styles.surahName}>{surah.name}</Text>
        <Text style={styles.surahType}>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</Text>
      </View>
    </View>

    <View style={styles.surahStats}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>عدد الآيات</Text>
        <Text style={styles.statValue}>{surah.verses}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>رقم الصفحة</Text>
        <Text style={styles.statValue}>{surah.page}</Text>
      </View>
    </View>
  </View>
);

const SurahSelectionScreen = ({ navigation }) => {
  const {
    form, surahOptions, selectedSurahData, setSelectedSurah,
    isButtonDisabled, disabledLabel, handleStartTest, goBack,
  } = useSurahSelection(navigation);

  return (
    <SelectionScreenLayout title="مواضع من سورة " onBack={goBack}>
      <SectionCard>
        <BottomSheetSelect
          label="السورة"
          placeholder="اختر السورة"
          title="اختر السورة"
          options={surahOptions}
          displayText={
            selectedSurahData
              ? `${selectedSurahData.number}. ${selectedSurahData.name} - ${selectedSurahData.verses} آية`
              : undefined
          }
          value={selectedSurahData?.number}
          onChange={setSelectedSurah}
        />
      </SectionCard>

      <QuestionOrderSection mode={form.mode} onChange={form.selectMode} />
      <QuestionCountSection value={form.questionCount} onChange={form.setQuestionCount} />

      {selectedSurahData && <SurahInfoCard surah={selectedSurahData} />}

      <StartButton
        onPress={handleStartTest}
        disabled={isButtonDisabled}
        disabledLabel={disabledLabel}
      />
    </SelectionScreenLayout>
  );
};

export default SurahSelectionScreen;
