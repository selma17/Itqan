import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

// Carte récapitulative : titre + lignes label/valeur. rows : [{ label, value }]
const InfoCard = ({ title, rows = [] }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    {rows.length > 0 && (
      <View style={styles.details}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 6,
  },
  details: {
    borderTopWidth: 2,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    gap: 5,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 70,
    textAlign: 'right',
  },
  value: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
});

export default InfoCard;
