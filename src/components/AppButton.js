import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

// variant : 'primary' (texte blanc) | 'accent' (texte doré) | 'outline'
const AppButton = ({ label, onPress, variant = 'primary', style }) => (
  <TouchableOpacity
    style={[styles.base, styles[variant], style]}
    onPress={onPress}
    activeOpacity={0.85}>
    <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    borderRadius: 16,
  },
  text: {
    fontSize: 17,
    textAlign: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryText: { fontWeight: '700', color: colors.textLight },
  accent: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  accentText: { fontWeight: '700', color: colors.secondary },
  outline: {
    backgroundColor: colors.bgLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  outlineText: { fontWeight: '600', color: colors.primary },
});

export default AppButton;
