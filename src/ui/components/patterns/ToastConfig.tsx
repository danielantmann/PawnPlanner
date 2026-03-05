import { View, Text, Appearance } from 'react-native';
import { colors } from '@/src/ui/theme/colors';
import type { ToastConfig } from 'react-native-toast-message';

const isDark = () => Appearance.getColorScheme() === 'dark';

const getToastStyles = () => ({
  background: isDark() ? colors.backgroundAltDark : colors.background,
  text: isDark() ? colors.textPrimaryDark : colors.textPrimary,
  border: colors.primary,
});

export const toastConfig: ToastConfig = {
  success: ({ text1 }) => {
    const s = getToastStyles();
    return (
      <View
        style={{
          backgroundColor: s.background,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderWidth: 1.5,
          borderColor: s.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.success,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>✓</Text>
        </View>
        <Text style={{ color: s.text, fontWeight: '600', fontSize: 14, flex: 1 }}>{text1}</Text>
      </View>
    );
  },

  error: ({ text1 }) => {
    const s = getToastStyles();
    return (
      <View
        style={{
          backgroundColor: s.background,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderWidth: 1.5,
          borderColor: s.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.danger,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>✕</Text>
        </View>
        <Text style={{ color: s.text, fontWeight: '600', fontSize: 14, flex: 1 }}>{text1}</Text>
      </View>
    );
  },

  info: ({ text1 }) => {
    const s = getToastStyles();
    return (
      <View
        style={{
          backgroundColor: s.background,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderWidth: 1.5,
          borderColor: s.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>i</Text>
        </View>
        <Text style={{ color: s.text, fontWeight: '600', fontSize: 14, flex: 1 }}>{text1}</Text>
      </View>
    );
  },
};
