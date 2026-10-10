import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { wp, hp, FONT_SIZES } from '../../utils/responsive';

// En-tête d'une question : badge (numéro) + nom de sourate + consigne.
const QuestionHeader = ({ badge, surahName, verseNumber, showSurahName }) => (
  <View style={styles.container}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{badge}</Text>
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.surahName}>{showSurahName ? `سورة ${surahName}` : '-------'}</Text>
      <Text style={styles.instruction}>اقرأ من قوله تعالى (آية {verseNumber}):</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: hp(10),
    gap: wp(10),
  },
  badge: {
    minWidth: wp(40),
    height: wp(40),
    paddingHorizontal: wp(10),
    borderRadius: wp(20),
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: colors.textLight,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahName: {
    fontSize: FONT_SIZES.surahName,
    fontWeight: '600',
    color: colors.primary,
  },
  instruction: {
    fontSize: FONT_SIZES.sm,
    color: colors.textSecondary,
  },
});

export default QuestionHeader;
