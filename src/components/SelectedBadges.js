import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

// Puces supprimables. items : [{ key, label }]
const SelectedBadges = ({ items, onRemove }) => {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.key} style={styles.badge}>
          <TouchableOpacity onPress={() => onRemove(item.key)} style={styles.remove}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.text}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    paddingVertical: 2,
    paddingHorizontal: 7,
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  text: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  remove: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 9,
    color: colors.textLight,
    fontWeight: 'bold',
  },
});

export default SelectedBadges;
