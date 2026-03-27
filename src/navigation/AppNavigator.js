import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from '../screens/MainScreen';
import SurahSelectionScreen from '../screens/SurahSelectionScreen';
import PageSelectionScreen from '../screens/PageSelectionScreen';
import HizbSelectionScreen from '../screens/HizbSelectionScreen';
import DuaaScreen from '../screens/DuaaScreen';
import TestScreen from '../screens/TestScreen';
import ResultsScreen from '../screens/ResultsScreen';
import CustomResultsScreen from '../screens/CustomResultsScreen';
import CustomTestScreen from '../screens/CustomTestScreen';
import CustomTestSetupScreen from '../screens/CustomTestSetupScreen';
import QuranReadingScreen from '../screens/QuranReadingScreen';
import TestsScreen from '../screens/TestsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#f8f6f0' },
        }}>
        
        <Stack.Screen 
          name="Main" 
          component={MainScreen}
          options={{ title: 'القائمة الرئيسية' }}
        />
        
        <Stack.Screen 
          name="SurahSelection" 
          component={SurahSelectionScreen}
          options={{ title: 'اختيار السورة' }}
        />
        
        <Stack.Screen 
          name="PageSelection" 
          component={PageSelectionScreen}
          options={{ title: 'اختيار الصفحات' }}
        />

        <Stack.Screen 
          name="HizbSelection" 
          component={HizbSelectionScreen}
          options={{ title: 'اختيار السورة' }}
        />
        
        <Stack.Screen 
          name="Duaa" 
          component={DuaaScreen}
          options={{ title: 'دعاء' }}
        />
        
        <Stack.Screen 
          name="Test" 
          component={TestScreen}
          options={{ title: 'الاختبار' }}
        />
        
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen}
          options={{ title: 'النتائج' }}
        />

        <Stack.Screen 
          name="CustomTestSetup" 
          component={CustomTestSetupScreen} 
        />

        <Stack.Screen 
          name="CustomTest" 
          component={CustomTestScreen} 
        />

        <Stack.Screen 
          name="CustomResults" 
          component={CustomResultsScreen} 
        />

        <Stack.Screen 
          name="QuranReading" 
          component={QuranReadingScreen}
          options={{ title: 'قراءة المصحف' }}
        />

      <Stack.Screen
        name="Tests"
        component={TestsScreen}
        options={{ title: 'الاختبارات' }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'الإعدادات' }}
      />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;