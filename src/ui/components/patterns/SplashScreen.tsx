import { View, ActivityIndicator, Image } from 'react-native';

export function SplashScreen() {
  return (
    <View className="bg-primary dark:bg-primaryDark flex-1 items-center justify-center">
      {/* Logo o icono */}
      <Image source={require('@/assets/icon.png')} className="mb-8 h-24 w-24" />

      {/* Loading indicator */}
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}
