import '../global.css';
import { Slot, useSegments, router } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { initI18n } from '@/src/i18n';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/src/modules/auth/store/auth.store';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loadSession = useAuthStore((s) => s.loadSession);
  const segments = useSegments();

  // Inicializar i18n + cargar sesión
  useEffect(() => {
    const init = async () => {
      await initI18n();
      await loadSession();
      setReady(true);
    };
    init();
  }, []);

  // Redirección automática basada en SEGMENTOS (Expo Router 6)
  useEffect(() => {
    if (!ready) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('REDIRECT CHECK:', { isAuthenticated, segments });

    // Si NO está autenticado y NO está en auth → mandar a login
    if (!isAuthenticated && !inAuthGroup) {
      console.log('REDIRECT TO LOGIN');
      router.replace('/(auth)/login');
      return;
    }

    // Si está autenticado y está en auth → mandar a home
    if (isAuthenticated && inAuthGroup) {
      console.log('REDIRECT TO HOME');
      router.replace('/(tabs)/home');
      return;
    }
  }, [ready, isAuthenticated, segments]);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
