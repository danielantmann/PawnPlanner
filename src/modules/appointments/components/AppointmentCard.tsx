import { View, Text } from 'react-native';
import type { AppointmentDTO } from '../types/appointment.types';

interface Props {
  appointment: AppointmentDTO;
}

export const AppointmentCard = ({ appointment }: Props) => {
  const start = new Date(appointment.startTime);
  const time = start.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusColor = {
    completed: 'text-green-600',
    'no-show': 'text-red-600',
    cancelled: 'text-gray-500',
  }[appointment.status];

  return (
    <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Text className="text-lg font-semibold">{appointment.petName}</Text>

      <Text className="text-gray-700">
        {appointment.ownerName} · {appointment.ownerPhone}
      </Text>

      <Text className="mt-1 text-gray-800">{appointment.serviceName}</Text>

      <View className="mt-2 flex-row justify-between">
        <Text className="text-gray-600">{time}</Text>
        <Text className={`font-medium ${statusColor}`}>{appointment.status}</Text>
      </View>
    </View>
  );
};
