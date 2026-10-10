import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFonts, ScheherazadeNew_400Regular } from '@expo-google-fonts/scheherazade-new';
import colors from '../../styles/colors';
import { wp, hp, FONT_SIZES, RADIUS } from '../../utils/responsive';

// Basmala + carte du verset (texte scrollable + ligne de métadonnées).
const VerseCard = ({ text, fontSize, footer, textAlign = 'center' }) => {
  useFonts({ ScheherazadeNew_400Regular });

  return (
    <View style={styles.wrapper}>
      <View style={styles.bismillahBox}>
        <Text style={styles.bismillah}>﷽</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.ornament} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
          persistentScrollbar>
          <Text style={[styles.text, { fontSize, lineHeight: fontSize * 1.8, textAlign }]}>{text}</Text>
        </ScrollView>
        <View style={styles.ornament} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{footer}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bismillahBox: {
    backgroundColor: colors.bgWhite,
    padding: hp(10),
    borderRadius: RADIUS.md,
    marginBottom: hp(10),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bismillah: {
    fontSize: FONT_SIZES.lg,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: RADIUS.xl,
    paddingVertical: hp(14),
    paddingHorizontal: wp(18),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(4) },
    shadowOpacity: 0.1,
    shadowRadius: wp(8),
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  ornament: {
    width: wp(50),
    height: 2,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: hp(8),
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: hp(8),
  },
  text: {
    color: colors.textPrimary,
    writingDirection: 'rtl',
    fontFamily: 'ScheherazadeNew_400Regular',
    includeFontPadding: false,
    marginRight: 10,
  },
  footer: {
    marginTop: hp(8),
    paddingTop: hp(8),
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerText: {
    fontSize: FONT_SIZES.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default VerseCard;
