import { View } from 'react-native';
import { Label } from '@/src/ui/components/primitives/Label';
import { Button } from '@/src/ui/components/primitives/Button';
import { useRouter } from 'expo-router';

export const EmptyAppointmentsCard = ({ full = false }) => {
  const router = useRouter();

  return (
    <View
      className={
        full
          ? 'bg-backgroundAlt dark:bg-backgroundDarkAlt w-full items-center justify-center rounded-xl p-6 shadow'
          : 'bg-backgroundAlt dark:bg-backgroundDarkAlt mr-4 w-64 items-center justify-center rounded-xl p-6 shadow'
      }>
      {/* Mensaje grande */}
      <Label className="text-textPrimary dark:text-textPrimaryDark mb-6 text-center text-lg font-semibold">
        No hay citas hoy
      </Label>

      {/* Botón redondo */}
      <Button
        icon="calendar"
        onPress={() => router.push('/appointment/new')}
        variant="primary"
        size="md"
        circle="lg"
      />

      {/* Texto fuera del botón */}
      <Label className="text-textSecondary dark:text-textSecondaryDark mt-2 text-center text-sm">
        Crear cita
      </Label>
    </View>
  );
};
