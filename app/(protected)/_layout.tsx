import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, Redirect } from 'expo-router';
import { useAuthStore } from '@/src/modules/auth/store/auth.store';
import { ActivityIndicator, View } from 'react-native';
import { AppHeader } from '@/src/ui/components/patterns/AppHeader';
import { DrawerMenu } from '@/src/ui/components/patterns/DrawerMenu/DrawerMenu';
import { colors } from '@/src/ui/theme/colors';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/src/ui/components/patterns/ToastConfig';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoadingSession } = useAuthStore();

  if (isLoadingSession) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }} edges={['top']}>
      <AppHeader />
      <Slot />
      <DrawerMenu />
      <Toast config={toastConfig} position="top" topOffset={60} />
    </SafeAreaView>
  );
}
