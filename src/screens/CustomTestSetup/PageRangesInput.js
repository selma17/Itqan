import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import styles from './styles';

const RangeField = ({ label, value, placeholder, onChange }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, !value && styles.inputEmpty]}
      keyboardType="number-pad"
      maxLength={3}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
    />
  </View>
);

// Liste de plages de pages (de / à) avec ajout et suppression.
const PageRangesInput = ({ ranges, onChange, onAdd, onRemove }) => (
  <>
    {ranges.map((range, index) => (
      <View key={index} style={styles.rangeRow}>
        <View style={styles.rangeInputs}>
          <RangeField
            label="من"
            value={range.from}
            placeholder="مثال: 1"
            onChange={(value) => onChange(index, 'from', value)}
          />
          <RangeField
            label="إلى"
            value={range.to}
            placeholder="مثال: 604"
            onChange={(value) => onChange(index, 'to', value)}
          />
        </View>
        {ranges.length > 1 && (
          <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(index)}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    ))}
    <TouchableOpacity style={styles.addButton} onPress={onAdd}>
      <Text style={styles.addButtonText}>+ إضافة نطاق</Text>
    </TouchableOpacity>
  </>
);

export default PageRangesInput;
