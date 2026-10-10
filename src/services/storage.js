import AsyncStorage from '@react-native-async-storage/async-storage';

// Toutes les clés AsyncStorage de l'app au même endroit.
export const STORAGE_KEYS = {
  VERSE_FONT_STEP: 'verse_font_step',
  LAST_TEST_PARAMS: 'lastTestParams',
  UPDATE_SNOOZE_UNTIL: 'update_snooze_until',
  BOOKMARKS: '@itqan_mushaf_bookmarks',
};

export const getItem = (key) => AsyncStorage.getItem(key);
export const setItem = (key, value) => AsyncStorage.setItem(key, String(value));

export const getJSON = async (key) => {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export const setJSON = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value));
