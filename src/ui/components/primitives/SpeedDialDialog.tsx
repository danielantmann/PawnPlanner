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
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/ui/theme/colors';

export interface SpeedDialAction {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface SpeedDialDialogProps {
  actions: SpeedDialAction[];
  mainIcon?: string;
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

  const panelBackground = scheme === 'dark' ? 'rgba(20,20,20,0.75)' : 'rgba(255,255,255,0.95)';

  const panelBorderColor = scheme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)';

  const separatorColor = scheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';

  const toggle = useCallback(() => {
    Animated.timing(anim, {
      toValue: open ? 0 : 1,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setOpen(!open));
  }, [open]);

  const handleActionPress = useCallback((action: SpeedDialAction) => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
      action.onPress();
    });
  }, []);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  const FAB_HEIGHT = 56;

  return (
    <View style={{ position: 'relative' }}>
      {open && (
        <TouchableWithoutFeedback onPress={toggle}>
          <View
            style={{
              position: 'absolute',
              top: -1000,
              left: -1000,
              right: 0,
              bottom: 0,
            }}
          />
        </TouchableWithoutFeedback>
      )}

      {/* FAB */}
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Pressable
          onPress={toggle}
          style={{
            borderRadius: 999,
            padding: 16,
            backgroundColor: primaryDarkColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <MaterialIcons name={mainIcon as any} size={24} color="white" />
        </Pressable>
      </Animated.View>

      {/* Panel */}
      {open && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: FAB_HEIGHT + 12,
            right: 0,
            opacity,
            transform: [{ scale }],
            backgroundColor: panelBackground,
            borderColor: panelBorderColor,
            borderWidth: 1,
            borderRadius: 16,
            paddingVertical: 6,
            paddingHorizontal: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
          }}>
          {actions.map((action, index) => (
            <View key={action.id}>
              <Pressable
                onPress={() => handleActionPress(action)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  minWidth: 150,
                }}>
                <MaterialIcons name={action.icon as any} size={22} color={colors.primary} />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: scheme === 'dark' ? 'white' : colors.textPrimary,
                    flexShrink: 1,
                  }}>
                  {action.label}
                </Text>
              </Pressable>

              {index < actions.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: separatorColor,
                    marginVertical: 4,
                    marginHorizontal: 4,
                  }}
                />
              )}
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
};
