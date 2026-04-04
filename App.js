import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import { QuranProvider } from './src/context/QuranContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    QaloonFont: require('./assets/fonts/qaloon.10.ttf'),
    HafsFont: require('./assets/fonts/hafs.ttf'),
    WarshFont: require('./assets/fonts/warsh.ttf'),
    DooriFont: require('./assets/fonts/doori.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f6f0' }}>
        <ActivityIndicator size="large" color="#2d5a3e" />
      </View>
    );
  }

  return (
    <QuranProvider>
      <AppNavigator />
    </QuranProvider>
  );
}