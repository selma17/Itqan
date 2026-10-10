import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { wp, hp, fp, FONT_SIZES, RADIUS } from '../../utils/responsive';

const TestHeader = ({ title, subtitle, backIcon = '←', onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>{backIcon}</Text>
    </TouchableOpacity>
    <View style={styles.headerContent}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingVertical: hp(12),
    paddingHorizontal: wp(16),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.1,
    shadowRadius: wp(4),
    elevation: 3,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  backButton: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(10),
    marginTop: hp(15),
  },
  backButtonText: {
    fontSize: fp(18),
    color: colors.textLight,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: hp(25),
    marginRight: wp(15),
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: wp(15),
  },
});

export default TestHeader;
