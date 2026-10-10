import React from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import colors from '../../styles/colors';
import AppButton from '../../components/AppButton';
import useResults from './useResults';
import styles from './styles';

const StatCard = ({ icon, label, value, style }) => (
  <View style={[styles.statCard, style]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const ResultsScreen = ({ navigation, route }) => {
  const { score, errors, total, percentage, level, backToTests, restartTest } = useResults(navigation, route);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>نتائج الاختبار</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.resultCard}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{level.emoji}</Text>
          </View>
          <Text style={styles.resultTitle}>{level.title}</Text>
          <Text style={styles.resultMessage}>{level.message}</Text>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageValue}>{percentage}%</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <StatCard icon="✓" label="صحيحة" value={score} style={styles.statCardSuccess} />
          <StatCard icon="✗" label="أخطاء" value={errors} style={styles.statCardError} />
          <StatCard icon="#" label="المجموع" value={total} />
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            ﴿ وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ﴾
          </Text>
          <Text style={styles.quoteReference}>الإسراء - 82</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <AppButton label="العودة للقائمة" onPress={backToTests} />
          <AppButton label="إعادة الاختبار" onPress={restartTest} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultsScreen;
