import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export function AuthFooter({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useTranslation();

  const isLogin = mode === 'login';

  return (
    <Pressable
      onPress={() => router.push(isLogin ? '/(auth)/register' : '/(auth)/login')}
      className="mt-6 py-2">
      <Text className="text-center">
        <Text className="text-gray-600 dark:text-gray-300">
          {isLogin ? t('auth.goToRegisterPrefix') : t('auth.goToLoginPrefix')}
        </Text>
        <Text className="text-primary font-medium underline">
          {' '}
          {isLogin ? t('auth.goToRegisterAction') : t('auth.goToLoginAction')}
        </Text>
      </Text>
    </Pressable>
  );
}
