import React from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import colors from '../../styles/colors';
import AppButton from '../../components/AppButton';
import useCustomResults from './useCustomResults';
import styles from './styles';

const Card = ({ title, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

const StatRow = ({ icon, iconBackground, text, color }) => (
  <View style={styles.statRow}>
    <View style={styles.statContent}>
      <Text style={[styles.statValue, color && { color }]}>{text}</Text>
    </View>
    <View style={[styles.statIconContainer, { backgroundColor: iconBackground }]}>
      <Text style={styles.statIcon}>{icon}</Text>
    </View>
  </View>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Chip = ({ label }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

const CustomResultsScreen = ({ navigation, route }) => {
  const r = useCustomResults(navigation, route);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>نتيجة الاختبار</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={[styles.performanceCard, { borderRightColor: r.performance.color }]}>
          <View style={styles.performanceContent}>
            <View style={styles.performanceTextContainer}>
              <Text style={styles.performanceEmoji}>{r.performance.emoji}</Text>
              <View style={styles.performanceText}>
                <Text style={[styles.performanceTitle, { color: r.performance.color }]}>
                  {r.performance.title}
                </Text>
                <Text style={styles.performanceMessage}>{r.performance.message}</Text>
              </View>
            </View>
            <View style={styles.percentageCircle}>
              <Text style={[styles.percentageText, { color: r.performance.color }]}>{r.percentage}%</Text>
            </View>
          </View>
        </View>

        <Card title="النتائج التفصيلية">
          <StatRow icon="📝" iconBackground={colors.secondaryLight} text={` إجمالي الأسئلة : ${r.totalQuestions} `} />
          <View style={styles.divider} />
          <StatRow
            icon="✓"
            iconBackground={colors.successLight}
            color={colors.success}
            text={`إجابات صحيحة : ${r.score} `}
          />
          <View style={styles.divider} />
          <StatRow
            icon="✗"
            iconBackground={colors.errorLight}
            color={colors.error}
            text={`إجابات خاطئة : ${r.errors}`}
          />
        </Card>

        <Card title="معلومات الاختبار">
          <InfoRow label="المصدر" value={r.sourceDescription} />

          {r.chips.length > 0 && (
            <View style={styles.chipsContainer}>
              {r.chips.map(chip => <Chip key={chip.key} label={chip.label} />)}
            </View>
          )}

          {r.pageRangeDetails.length > 0 && (
            <View style={styles.chipsContainer}>
              {r.pageRangeDetails.map(range => (
                <View key={range.key} style={styles.pageRangeDetail}>
                  <Chip label={range.label} />
                  {range.surahs.length > 0 && (
                    <Text style={styles.surahHint}>{range.surahs.join(' • ')}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={styles.divider} />
          <InfoRow label="النمط" value={r.modeLabel} />
          <View style={styles.divider} />
          <InfoRow label="عدد الآيات للقراءة" value={`${r.versesToRead} آيات`} />
          <View style={styles.divider} />
          <InfoRow label="مدة الاختبار " value={r.durationLabel} />
        </Card>

        <View style={styles.actionsContainer}>
          <AppButton label="إعادة نفس الاختبار" onPress={r.retryTest} variant="accent" />
          <AppButton label="اختبار مخصص جديد" onPress={r.newTest} variant="accent" />
          <AppButton label="العودة لقائمة الإختبارات" onPress={r.backToTests} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomResultsScreen;
