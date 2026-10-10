import React from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import ScreenHeader from './ScreenHeader';

// Squelette commun des écrans de configuration de test : header + contenu scrollable.
const SelectionScreenLayout = ({ title, onBack, children, keyboardShouldPersistTaps, headerProps }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
    <ScreenHeader title={title} onBack={onBack} {...headerProps} />
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: 20 },
  content: { padding: 14 },
});

export default SelectionScreenLayout;
