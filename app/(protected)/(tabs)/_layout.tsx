import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ← EL HEADER VIENE DEL LAYOUT PADRE
        tabBarActiveTintColor: isDark ? '#6366F1' : '#4F46E5',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A22' : '#FFFFFF',
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="agenda/index"
        options={{
          title: t('navigation.agenda'),
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="search/index"
        options={{
          title: t('navigation.search'),
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="stats/index"
        options={{
          title: t('navigation.stats'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />

      <Tabs.Screen name="animals/index" options={{ href: null }} />
      <Tabs.Screen name="species/index" options={{ href: null }} />
      <Tabs.Screen name="breeds/index" options={{ href: null }} />
      <Tabs.Screen name="owners/index" options={{ href: null }} />
      <Tabs.Screen name="pets/index" options={{ href: null }} />
      <Tabs.Screen name="services/index" options={{ href: null }} />
      <Tabs.Screen name="workers/index" options={{ href: null }} />
    </Tabs>
  );
}
