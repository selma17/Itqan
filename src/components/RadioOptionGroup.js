import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

// Groupe de boutons radio. options : [{ value, label }]
// horizontal : options côte à côte au lieu d'être empilées.
const RadioOptionGroup = ({ options, value, onChange, horizontal = false }) => (
  <View style={horizontal ? styles.row : styles.column}>
    {options.map((option) => {
      const selected = value === option.value;
      return (
        <TouchableOpacity
          key={String(option.value)}
          style={[styles.button, horizontal && styles.flex, selected && styles.buttonActive]}
          onPress={() => onChange(option.value)}>
          <Text style={[styles.text, selected && styles.textActive]}>{option.label}</Text>
          <View style={[styles.radio, selected && styles.radioActive]}>
            {selected && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  column: { gap: 3 },
  row: { flexDirection: 'row-reverse', gap: 10 },
  flex: { flex: 1 },
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 14,
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.secondary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioActive: { borderColor: colors.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    fontWeight: '500',
  },
  textActive: { color: colors.primary, fontWeight: '600' },
});

export default RadioOptionGroup;
