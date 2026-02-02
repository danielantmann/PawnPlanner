import { Slot, Redirect } from 'expo-router';
import { useAuthStore } from '@/src/modules/auth/store/auth.store';
import { View, ActivityIndicator } from 'react-native';

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

  return <Slot />;
}
