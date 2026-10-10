import { Alert, Platform, ToastAndroid } from 'react-native';

// Toast sur Android, alerte sur les autres plateformes.
export const showMessage = (message, { long = false } = {}) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, long ? ToastAndroid.LONG : ToastAndroid.SHORT);
  } else {
    Alert.alert('تنبيه', message);
  }
};
