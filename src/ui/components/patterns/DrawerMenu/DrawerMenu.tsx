import { Pressable, Animated, Dimensions, useColorScheme, ScrollView } from 'react-native';
import { useEffect, useRef, useCallback } from 'react';
import { DrawerMenuSection } from './DrawerMenuSection';
import { DrawerMenuItem } from './DrawerMenuItem';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/src/store/ui.store';
import { useActiveRoute } from '@/src/ui/hooks/useActiveRoute';
import { useDrawerNavigation } from '@/src/ui/hooks/useDrawerNavigation';
import { DrawerUserHeader } from './DrawerUserHeader';
import { colors } from '@/src/ui/theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

export const DrawerMenu = () => {
  const { t } = useTranslation();
  const isOpen = useUIStore((s) => s.isDrawerOpen);
  const closeDrawer = useUIStore((s) => s.closeDrawer);
  const isDark = useColorScheme() === 'dark';

  const active = useActiveRoute();
  const { go } = useDrawerNavigation();

  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;

  const animateDrawer = useCallback(
    (open: boolean) => {
      Animated.timing(translateX, {
        toValue: open ? 0 : DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    [translateX]
  );

  useEffect(() => {
    animateDrawer(isOpen);
  }, [isOpen, animateDrawer]);

  return (
    <>
      {isOpen && <Pressable onPress={closeDrawer} className="absolute inset-0 bg-black/50" />}

      <Animated.View
        className="absolute bottom-0 right-0 top-0 px-5"
        style={{
          width: DRAWER_WIDTH,
          transform: [{ translateX }],
          backgroundColor: isDark ? colors.backgroundDark : colors.background,
          paddingTop: 60,
        }}>
        {/* HEADER — NO SCROLL */}
        <DrawerUserHeader onClose={closeDrawer} />

        {/* LISTA SCROLLEABLE */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
            gap: 10, // separación uniforme entre items y secciones
          }}>
          <DrawerMenuSection title={t('drawer.sections.shortcuts')} icon="flash" />

          <DrawerMenuItem
            label={t('drawer.items.home')}
            isActive={active === 'home'}
            onPress={() => go('/(protected)/(tabs)/home')}
          />

          <DrawerMenuItem
            label={t('drawer.items.agenda')}
            isActive={active === 'agenda'}
            onPress={() => go('/(protected)/(tabs)/agenda')}
          />

          <DrawerMenuItem
            label={t('drawer.items.stats')}
            isActive={active === 'stats'}
            onPress={() => go('/(protected)/(tabs)/stats')}
          />

          <DrawerMenuItem
            label={t('drawer.items.search')}
            isActive={active === 'search'}
            onPress={() => go('/(protected)/(tabs)/search')}
          />

          <DrawerMenuSection title={t('drawer.sections.management')} icon="briefcase" />

          <DrawerMenuItem
            label={t('drawer.items.owners')}
            isActive={active === 'owners'}
            onPress={() => go('/(protected)/(tabs)/owners')}
          />
          <DrawerMenuItem
            label={t('drawer.items.pets')}
            isActive={active === 'pets'}
            onPress={() => go('/(protected)/(tabs)/pets')}
          />
          <DrawerMenuItem
            label={t('drawer.items.animals')}
            isActive={active === 'animals'}
            onPress={() => go('/(protected)/(tabs)/animals')}
          />
          <DrawerMenuItem
            label={t('drawer.items.species')}
            isActive={active === 'species'}
            onPress={() => go('/(protected)/(tabs)/species')}
          />
          <DrawerMenuItem
            label={t('drawer.items.breeds')}
            isActive={active === 'breeds'}
            onPress={() => go('/(protected)/(tabs)/breeds')}
          />
          <DrawerMenuItem
            label={t('drawer.items.services')}
            isActive={active === 'services'}
            onPress={() => go('/(protected)/(tabs)/services')}
          />
          <DrawerMenuItem
            label={t('drawer.items.workers')}
            isActive={active === 'workers'}
            onPress={() => go('/(protected)/(tabs)/workers')}
          />

          <DrawerMenuSection title={t('drawer.sections.settings')} icon="settings" />

          <DrawerMenuItem
            label={t('drawer.items.profileSettings')}
            isActive={active === 'profile'}
            onPress={() => go('/(protected)/(tabs)/profile')}
          />
        </ScrollView>
      </Animated.View>
    </>
  );
};
