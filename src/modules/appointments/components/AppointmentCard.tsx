import { View } from 'react-native';
import type { AppointmentDTO } from '../types/appointment.types';
import { Title } from '@/src/ui/components/primitives/Title';
import { BodyText } from '@/src/ui/components/primitives/BodyText';
import { Label } from '@/src/ui/components/primitives/Label';

interface Props {
  appointment: AppointmentDTO;
}

export const AppointmentCard = ({ appointment }: Props) => {
  const start = new Date(appointment.startTime);
  const time = start.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Estado → badge
  const statusStyles = {
    completed: 'bg-success/15 text-success border-success/30',
    'no-show': 'bg-danger/15 text-danger border-danger/30',
    cancelled: 'bg-danger/15 text-danger border-danger/30',
  }[appointment.status];

  return (
    <View className="bg-background dark:bg-backgroundDarkAlt mb-3 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700">
      {/* Mascota */}
      <Title className="text-lg">{appointment.petName}</Title>

      {/* Dueño */}
      <BodyText className="mt-0.5">
        {appointment.ownerName} · {appointment.ownerPhone}
      </BodyText>

      {/* Servicio */}
      <BodyText className="mt-1 font-medium">{appointment.serviceName}</BodyText>

      {/* Hora + Estado */}
      <View className="mt-3 flex-row items-center justify-between">
        <Label className="text-textSecondary dark:text-textSecondaryDark">{time}</Label>

        {/* Badge */}
        <View className={`rounded-md border px-2 py-1 ${statusStyles}`}>
          <Label className="font-semibold capitalize">{appointment.status}</Label>
        </View>
      </View>
    </View>
  );
};
