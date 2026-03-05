import Toast from 'react-native-toast-message';
import { colors } from '@/src/ui/theme/colors';

export const useToast = () => {
  const success = (message: string) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const error = (message: string) => {
    Toast.show({
      type: 'error',
      text1: message,
      position: 'bottom',
      visibilityTime: 4000,
    });
  };

  const info = (message: string) => {
    Toast.show({
      type: 'info',
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  return { success, error, info };
};
