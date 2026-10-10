import React from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import { SPACING, FONT_SIZES } from '../utils/responsive';

// Écran plein cadre : spinner + message (ou message seul si spinner=false).
const LoadingView = ({ message, spinner = true }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
    <View style={styles.content}>
      {spinner && <ActivityIndicator size="large" color={colors.primary} />}
      <Text style={styles.text}>{message}</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  text: {
    fontSize: FONT_SIZES.md,
    color: colors.textSecondary,
  },
});

export default LoadingView;
