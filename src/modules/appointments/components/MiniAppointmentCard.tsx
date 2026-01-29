import { View } from 'react-native';
import { Title } from '@/src/ui/components/primitives/Title';
import { BodyText } from '@/src/ui/components/primitives/BodyText';
import { Label } from '@/src/ui/components/primitives/Label';

export interface MiniAppointmentCardProps {
  id?: number; // opcional si lo necesitas
  petName: string;
  ownerName: string;
  serviceName: string;
  time: string;
  status: 'completed' | 'no-show' | 'cancelled';
  full?: boolean;
}

export const MiniAppointmentCard = ({
  petName,
  ownerName,
  serviceName,
  time,
  status,
  full = false,
}: MiniAppointmentCardProps) => {
  const statusStyles = {
    completed: 'bg-success/15 text-success border-success/30',
    'no-show': 'bg-danger/15 text-danger border-danger/30',
    cancelled: 'bg-danger/15 text-danger border-danger/30',
  }[status];

  return (
    <View
      className={
        full
          ? 'bg-backgroundAlt dark:bg-backgroundDarkAlt mb-4 w-full rounded-2xl p-6 shadow'
          : 'bg-backgroundAlt dark:bg-backgroundDarkAlt mr-4 w-72 rounded-2xl p-5 shadow'
      }>
      <Title className="text-xl">{petName}</Title>
      <BodyText className="mt-1 text-base">{ownerName}</BodyText>
      <Label className="mt-2 text-sm">{serviceName}</Label>

      <View className="mt-4 flex-row items-center justify-between">
        <Label className="text-textSecondary dark:text-textSecondaryDark text-base">{time}</Label>

        <View className={`rounded-md border px-3 py-1.5 ${statusStyles}`}>
          <Label className="text-sm font-semibold capitalize">{status}</Label>
        </View>
      </View>
    </View>
  );
};
