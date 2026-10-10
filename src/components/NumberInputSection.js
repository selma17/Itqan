import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import SectionCard from './SectionCard';

// Carte avec titre + champ numérique centré.
const NumberInputSection = ({ title, value, onChange, placeholder = 'مثال: 10', onFocus }) => (
  <SectionCard title={title}>
    <TextInput
      style={[styles.input, !value && styles.inputEmpty]}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      textAlign="center"
    />
  </SectionCard>
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    padding: 5,
    fontSize: 20,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    textAlign: 'center',
    fontWeight: '700',
  },
  inputEmpty: { fontSize: 14, fontWeight: '400' },
});

export default NumberInputSection;
