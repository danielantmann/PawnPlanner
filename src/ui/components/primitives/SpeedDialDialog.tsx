import {
  View,
  Pressable,
  Text,
  Animated,
  TouchableWithoutFeedback,
  useColorScheme,
  Easing,
} from 'react-native';
import { useRef, useState, useCallback } from 'react';
import { colors } from '@/src/ui/theme/colors';
import { Icon, type IconName } from '@/src/ui/components/primitives/Icon';

export interface SpeedDialAction {
  id: string;
  label: string;
  icon: IconName;
  onPress: () => void;
}

interface SpeedDialDialogProps {
  actions: SpeedDialAction[];
  mainIcon?: IconName;
  primaryDarkColor?: string;
}

export const SpeedDialDialog = ({
  actions,
  mainIcon = 'add',
  primaryDarkColor = colors.primaryDark,
}: SpeedDialDialogProps) => {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const panelBackground = isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.95)';
  const panelBorderColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)';
  const separatorColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';

  const toggle = useCallback(() => {
    Animated.timing(anim, {
      toValue: open ? 0 : 1,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setOpen(!open));
  }, [open, anim]);

  const handleActionPress = useCallback(
    (action: SpeedDialAction) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setOpen(false);
        action.onPress();
      });
    },
    [anim]
  );

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  const FAB_HEIGHT = 56;

  const panelShadow = isDark
    ? {}
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      };

  return (
    <View className="relative">
      {open && (
        <TouchableWithoutFeedback onPress={toggle}>
          <View className="absolute inset-0 bg-transparent" />
        </TouchableWithoutFeedback>
      )}

      {/* FAB */}
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Pressable
          onPress={toggle}
          className="rounded-full p-4"
          style={{
            backgroundColor: primaryDarkColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Icon name={mainIcon} size="lg" color="white" />
        </Pressable>
      </Animated.View>

      {/* PANEL */}
      {open && (
        <Animated.View
          style={{
            opacity,
            transform: [{ scale }],
            backgroundColor: panelBackground,
            borderColor: panelBorderColor,
            ...panelShadow,
            position: 'absolute',
            bottom: FAB_HEIGHT + 12,
            right: 0,
          }}
          className="rounded-2xl border px-3 py-1.5">
          {actions.map((action, index) => (
            <View key={action.id}>
              <Pressable
                onPress={() => handleActionPress(action)}
                className="min-w-[150px] flex-row items-center gap-2 rounded-xl px-3 py-2">
                <Icon name={action.icon} size="md" color="primary" />
                <Text
                  className={`flex-shrink text-[15px] font-semibold ${
                    isDark ? 'text-white' : 'text-textPrimary'
                  }`}>
                  {action.label}
                </Text>
              </Pressable>

              {index < actions.length - 1 && (
                <View style={{ backgroundColor: separatorColor }} className="mx-1 my-1 h-[1px]" />
              )}
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
};
