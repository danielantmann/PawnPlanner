import { Pressable, Animated, useColorScheme } from 'react-native';
import { useEffect, useRef } from 'react';

type DrawerMenuItemProps = {
  label: string;
  onPress: () => void;
  isActive: boolean;
};

export const DrawerMenuItem = ({ label, onPress, isActive }: DrawerMenuItemProps) => {
  const isDark = useColorScheme() === 'dark';

  // Valores animados
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0.7)).current;
  const scaleY = useRef(new Animated.Value(isActive ? 1.05 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: isActive ? 1 : 0.7,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(scaleY, {
        toValue: isActive ? 1.05 : 1,
        speed: 12,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, opacity, scaleY]);

  return (
    <Pressable onPress={onPress} className="py-2">
      <Animated.Text
        style={{
          opacity,
          transform: [{ scaleY }],
        }}
        className={
          `ml-1 uppercase ` +
          (isActive
            ? 'text-[14px] font-semibold text-primary'
            : 'text-[13px] font-medium ' + (isDark ? 'text-textPrimaryDark' : 'text-textPrimary'))
        }>
        {label}
      </Animated.Text>
    </Pressable>
  );
};
