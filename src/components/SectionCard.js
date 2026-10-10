import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

// Carte blanche avec titre optionnel, pour grouper un champ de formulaire.
const SectionCard = ({ title, children, style }) => (
  <View style={[styles.card, style]}>
    {title ? <Text style={styles.title}>{title}</Text> : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
    textAlign: 'right',
  },
});

export default SectionCard;
