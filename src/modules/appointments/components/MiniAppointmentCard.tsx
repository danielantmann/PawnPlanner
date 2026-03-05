import { View } from 'react-native';
import { Title } from '@/src/ui/components/primitives/Title';
import { BodyText } from '@/src/ui/components/primitives/BodyText';
import { Label } from '@/src/ui/components/primitives/Label';

export interface MiniAppointmentCardProps {
  id?: number;
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
          ? 'mb-4 w-full rounded-2xl bg-backgroundAlt p-6 shadow dark:bg-backgroundAltDark'
          : 'mr-4 w-72 rounded-2xl bg-backgroundAlt p-5 shadow dark:bg-backgroundAltDark'
      }>
      <Title className="text-xl">{petName}</Title>
      <BodyText className="mt-1 text-base">{ownerName}</BodyText>
      <Label className="mt-2 text-sm">{serviceName}</Label>

      <View className="mt-4 flex-row items-center justify-between">
        <Label className="text-base text-textSecondary dark:text-textSecondaryDark">{time}</Label>
        <View className={`rounded-md border px-3 py-1.5 ${statusStyles}`}>
          <Label className="text-sm font-semibold capitalize">{status}</Label>
        </View>
      </View>
    </View>
  );
};
