import '../global.css';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { initI18n } from '@/src/i18n';
import { useAuthStore } from '@/src/modules/auth/store/auth.store';
import { SplashScreen } from '@/src/ui/components/patterns/SplashScreen';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const { isLoadingSession, isAuthenticated } = useAuthStore();
  const loadSession = useAuthStore((s) => s.loadSession);

  useEffect(() => {
    const init = async () => {
      await initI18n();
      await loadSession();
      setAppReady(true);
    };
    init();
  }, [loadSession]);

  if (isLoadingSession || !appReady) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? '(protected)' : '(auth)'}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(protected)" />
      </Stack>
    </QueryClientProvider>
  );
}
