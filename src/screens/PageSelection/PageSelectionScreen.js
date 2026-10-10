import React from 'react';
import { View, Text, TextInput } from 'react-native';
import colors from '../../styles/colors';
import SelectionScreenLayout from '../../components/SelectionScreenLayout';
import SectionCard from '../../components/SectionCard';
import QuestionOrderSection from '../../components/QuestionOrderSection';
import QuestionCountSection from '../../components/QuestionCountSection';
import ShowSurahNameSection from '../../components/ShowSurahNameSection';
import StartButton from '../../components/StartButton';
import usePageSelection from './usePageSelection';
import styles from './styles';

const PageInput = ({ label, value, onChange, placeholder, returnKeyType }) => (
  <>
    <View style={styles.separator}>
      <View style={styles.separatorLine} />
      <Text style={styles.separatorText}>{label}</Text>
      <View style={styles.separatorLine} />
    </View>
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, !value && styles.inputEmpty]}
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        maxLength={3}
        returnKeyType={returnKeyType}
      />
      <View style={styles.inputUnderline} />
    </View>
  </>
);

const PageSelectionScreen = ({ navigation }) => {
  const {
    form, pageFrom, pageTo, setPageFrom, setPageTo, isRangeValid, pageCount,
    isButtonDisabled, disabledLabel, handleStartTest, goBack,
  } = usePageSelection(navigation);

  return (
    <SelectionScreenLayout title="مواضع من صفحات" onBack={goBack} keyboardShouldPersistTaps="handled">
      <SectionCard>
        <PageInput
          label="من الصفحة"
          value={pageFrom}
          onChange={setPageFrom}
          placeholder="مثال: 1"
          returnKeyType="next"
        />
        <PageInput
          label="إلى الصفحة"
          value={pageTo}
          onChange={setPageTo}
          placeholder="مثال: 604"
          returnKeyType="done"
        />
      </SectionCard>

      <QuestionOrderSection mode={form.mode} onChange={form.selectMode} />
      <QuestionCountSection value={form.questionCount} onChange={form.setQuestionCount} />
      <ShowSurahNameSection value={form.showSurahName} onChange={form.setShowSurahName} />

      {isRangeValid && (
        <View style={styles.rangeInfoCard}>
          <View style={styles.pageCountBox}>
            <Text style={styles.pageCountLabel}>عدد الصفحات:</Text>
            <Text style={styles.pageCountValue}>{pageCount}</Text>
          </View>
        </View>
      )}

      <View style={styles.helpBox}>
        <Text style={styles.helpIcon}>ℹ️</Text>
        <View style={styles.helpContent}>
          <Text style={styles.helpTitle}>معلومة</Text>
          <Text style={styles.helpText}>
            القرآن الكريم يحتوي على 604 صفحات في مصحف المدينة النبوية
          </Text>
        </View>
      </View>

      <StartButton
        onPress={handleStartTest}
        disabled={isButtonDisabled}
        disabledLabel={disabledLabel}
      />
    </SelectionScreenLayout>
  );
};

export default PageSelectionScreen;
