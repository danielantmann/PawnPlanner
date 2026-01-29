import { View, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AppointmentModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="bg-background dark:bg-backgroundDark flex-1 justify-center p-6">
      <Text className="text-textPrimary dark:text-textPrimaryDark mb-4 text-2xl font-bold">
        Detalle de cita #{id}
      </Text>

      <Button title="Cerrar" onPress={() => router.back()} />
    </View>
  );
}
