import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import colors from '../../styles/colors';
import TestHeader from '../../components/test/TestHeader';
import ScoreBar from '../../components/test/ScoreBar';
import QuestionHeader from '../../components/test/QuestionHeader';
import VerseCard from '../../components/test/VerseCard';
import ChoiceModal from '../../components/test/ChoiceModal';
import LoadingView from '../../components/LoadingView';
import useTestSession from './useTestSession';
import styles from './styles';

const TestScreen = ({ navigation, route }) => {
  const session = useTestSession(navigation, route);
  const { currentVerse } = session;

  if (!session.ready) return null;
  if (session.loading) return <LoadingView message="جارٍ تحميل الأسئلة..." />;
  if (!currentVerse) return <LoadingView spinner={false} message="لا توجد آيات متاحة" />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <TestHeader title="اختبار القرآن الكريم" onBack={session.backToMain} />

      <ScoreBar
        items={[
          { value: session.score, label: 'صحيح' },
          { value: session.errors, label: 'خطأ' },
        ]}
      />

      <View style={styles.mainContent}>
        <QuestionHeader
          badge={session.questionNumber}
          surahName={currentVerse.surahName}
          verseNumber={currentVerse.verseNumber}
          showSurahName={session.showSurahName}
        />
        <VerseCard
          text={currentVerse.text}
          fontSize={session.verseFontSize}
          footer={`الآية ${currentVerse.verseNumber} • الصفحة ${currentVerse.page || '-'} • الجزء ${currentVerse.juz || '-'}`}
        />
      </View>

      <View style={styles.controlsContainer}>
        {session.hasDefinedQuestionCount && (
          <View style={styles.questionCounter}>
            <Text style={styles.questionCounterText}>{session.questionProgress}</Text>
          </View>
        )}

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlButton} onPress={session.previousVerse}>
            <Text style={styles.controlButtonText}>السابقة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={session.nextVerse}>
            <Text style={styles.controlButtonText}>التالية</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.newQuestionButton} onPress={() => session.setShowAnswerModal(true)}>
          <Text style={styles.newQuestionButtonText}>سؤال جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quitButton} onPress={() => session.setShowQuitModal(true)}>
          <Text style={styles.quitButtonText}>إنهاء</Text>
        </TouchableOpacity>
      </View>

      <ChoiceModal
        visible={session.showAnswerModal}
        title="هل أجبت بشكل صحيح؟"
        onRequestClose={() => session.setShowAnswerModal(false)}
        actions={[
          { label: 'نعم', variant: 'success', onPress: session.answerCorrect },
          { label: 'لا', variant: 'error', onPress: session.answerWrong },
        ]}
      />

      <ChoiceModal
        visible={session.showQuitModal}
        title="تأكيد الخروج"
        message="هل تريد إنهاء الاختبار؟"
        onRequestClose={() => session.setShowQuitModal(false)}
        actions={[
          { label: 'متابعة', variant: 'primary', onPress: () => session.setShowQuitModal(false) },
          { label: 'إنهاء', variant: 'secondary', onPress: session.quit },
        ]}
      />
    </SafeAreaView>
  );
};

export default TestScreen;
