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
          ? 'w-full items-center justify-center rounded-xl bg-backgroundAlt p-6 shadow dark:bg-backgroundAltDark'
          : 'mr-4 w-64 items-center justify-center rounded-xl bg-backgroundAlt p-6 shadow dark:bg-backgroundAltDark'
      }>
      <Label className="mb-6 text-center text-lg font-semibold text-textPrimary dark:text-textPrimaryDark">
        No hay citas hoy
      </Label>
      <Button
        icon="calendar"
        onPress={() => router.push('/appointment/new')}
        variant="primary"
        size="md"
        circle="lg"
      />
      <Label className="mt-2 text-center text-sm text-textSecondary dark:text-textSecondaryDark">
        Crear cita
      </Label>
    </View>
  );
};
