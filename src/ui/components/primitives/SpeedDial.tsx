import { View, Pressable, Animated, Text } from 'react-native';
import { useRef, useState, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/ui/theme/colors';

export interface SpeedDialAction {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface SpeedDialFABProps {
  actions: SpeedDialAction[];
  mainIcon?: string;
  mainLabel?: string;
  primaryColor?: string;
  primaryDarkColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SpeedDialFAB = ({
  actions,
  mainIcon = 'add',
  mainLabel = 'Menu',
  primaryColor = colors.primary,
  primaryDarkColor = colors.primaryDark,
  size = 'md',
}: SpeedDialFABProps) => {
  const [fabOpen, setFabOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const sizeConfig = {
    sm: { padding: 3, iconSize: 20, spacing: 50 },
    md: { padding: 4, iconSize: 24, spacing: 70 },
    lg: { padding: 5, iconSize: 28, spacing: 90 },
  };

  const config = sizeConfig[size];

  // Toggle FAB menu
  const toggleFab = useCallback(() => {
    if (!fabOpen) {
      // Abriendo
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          speed: 10,
          bounciness: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setFabOpen(true);
    } else {
      // Cerrando
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          speed: 10,
          bounciness: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setFabOpen(false);
      });
    }
  }, [fabOpen, scaleAnim, rotateAnim]);

  // Handler para cada acción
  const handleActionPress = useCallback(
    (action: SpeedDialAction) => {
      // Cerrar FAB
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          speed: 10,
          bounciness: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setFabOpen(false);
      });

      // Ejecutar acción después de cerrar
      setTimeout(() => {
        action.onPress();
      }, 200);
    },
    [scaleAnim, rotateAnim]
  );

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const animatedRotateStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View className="absolute bottom-6 right-6 z-50">
      {/* Acciones - Compacto */}
      {fabOpen &&
        actions.map((action, index) => {
          const bottomOffset = config.spacing * (index + 1);

          return (
            <Animated.View
              key={action.id}
              style={{
                position: 'absolute',
                bottom: bottomOffset,
                right: 0,
                opacity: scaleAnim,
                transform: [{ scale: scaleAnim }],
              }}>
              <Pressable
                onPress={() => handleActionPress(action)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 8,
                  paddingLeft: 12,
                  paddingRight: 16,
                  borderRadius: 24,
                  backgroundColor: primaryColor,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <MaterialIcons name={action.icon as any} size={config.iconSize} color="white" />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 13,
                  }}>
                  {action.label}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}

      {/* FAB Principal */}
      <Animated.View style={animatedRotateStyle}>
        <Pressable
          onPress={toggleFab}
          className="rounded-full shadow-lg"
          style={{
            padding: config.padding * 4,
            backgroundColor: primaryDarkColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <MaterialIcons name={mainIcon as any} size={config.iconSize} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  );
};
