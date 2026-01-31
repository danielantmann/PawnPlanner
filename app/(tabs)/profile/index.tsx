import { View, Text, Button } from 'react-native';
import { useAuthStore } from '@/src/modules/auth/store/auth.store';

export default function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-4 text-xl font-semibold">Perfil</Text>

      <Button title="Logout" onPress={logout} />
    </View>
  );
}
