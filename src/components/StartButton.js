import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const StartButton = ({ onPress, disabled, label = 'بدء الاختبار', disabledLabel }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.buttonDisabled]}
    onPress={onPress}
    activeOpacity={0.85}
    disabled={disabled}>
    <Text style={styles.text}>{disabled && disabledLabel ? disabledLabel : label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: { fontSize: 18, fontWeight: '700', color: colors.textLight },
});

export default StartButton;
