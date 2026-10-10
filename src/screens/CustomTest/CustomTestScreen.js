import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import colors from '../../styles/colors';
import TestHeader from '../../components/test/TestHeader';
import ScoreBar from '../../components/test/ScoreBar';
import QuestionHeader from '../../components/test/QuestionHeader';
import VerseCard from '../../components/test/VerseCard';
import ChoiceModal from '../../components/test/ChoiceModal';
import LoadingView from '../../components/LoadingView';
import { formatTimer } from '../../utils/format';
import useCustomTestSession from './useCustomTestSession';
import styles from './styles';

const CustomTestScreen = ({ navigation, route }) => {
  const session = useCustomTestSession(navigation, route);
  const { currentVerse, isCompleted } = session;

  if (!session.ready) return null;
  if (session.loading || !currentVerse) return <LoadingView message="جاري تحميل الاختبار..." />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <TestHeader
        title="اختبار مخصص"
        subtitle={`⏱ ${formatTimer(session.elapsed)}`}
        backIcon="✕"
        onBack={() => session.setShowQuitModal(true)}
      />

      <ScoreBar
        items={[
          { value: session.errors, label: '✗' },
          { value: session.score, label: '✓' },
        ]}
      />

      <View style={styles.mainContent}>
        <QuestionHeader
          badge={session.questionProgress}
          surahName={currentVerse.surahName}
          verseNumber={currentVerse.verseNumber}
          showSurahName={session.showSurahName}
        />
        <VerseCard
          text={currentVerse.text}
          fontSize={session.verseFontSize}
          textAlign="right"
          footer={`صفحة ${currentVerse.page} • جزء ${currentVerse.juz}`}
        />
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            {Math.min(session.versesReadCount, session.versesToRead)}/{session.versesToRead}
            {isCompleted && ' ✓'}
          </Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={session.nextVerse}
            activeOpacity={0.8}
            disabled={isCompleted}>
            <Text style={[styles.controlButtonText, isCompleted && styles.controlButtonTextDisabled]}>
              الآية التالية
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainButton, isCompleted ? styles.mainButtonSuccess : styles.mainButtonError]}
            onPress={session.nextQuestion}
            activeOpacity={0.85}>
            <Text style={styles.mainButtonText}>{session.mainButtonLabel}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.quitButton}
          onPress={() => session.setShowQuitModal(true)}
          activeOpacity={0.8}>
          <Text style={styles.quitButtonText}>إنهاء</Text>
        </TouchableOpacity>
      </View>

      <ChoiceModal
        visible={session.showQuitModal}
        title="تأكيد الخروج"
        message="هل تريد إنهاء الاختبار؟ سيتم احتساب الأسئلة المتبقية كأخطاء."
        onRequestClose={() => session.setShowQuitModal(false)}
        actions={[
          { label: 'متابعة', variant: 'primary', onPress: () => session.setShowQuitModal(false) },
          { label: 'إنهاء', variant: 'secondary', onPress: session.quit },
        ]}
      />
    </SafeAreaView>
  );
};

export default CustomTestScreen;
