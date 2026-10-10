import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { wp, hp, FONT_SIZES } from '../../utils/responsive';

// items : [{ value, label }] — affichés de droite à gauche.
const ScoreBar = ({ items }) => (
  <View style={styles.bar}>
    {items.map((item, index) => (
      <React.Fragment key={item.label}>
        {index > 0 && <View style={styles.divider} />}
        <View style={styles.item}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      </React.Fragment>
    ))}
  </View>
);

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.bgWhite,
    flexDirection: 'row-reverse',
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.secondary,
    marginHorizontal: wp(16),
  },
});

export default ScoreBar;
