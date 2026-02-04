import { Text, View } from 'react-native';
import { format } from 'date-fns';
import { CalendarEvent } from '../../types/calendar-event.types';
import { EVENT_COLORS } from '../../utils/eventColors';

interface Props {
  event: CalendarEvent;
}

export const EventCardFull = ({ event }: Props) => {
  return (
    <View className="flex-1">
      <View
        className="flex-1 rounded-md bg-background px-1 py-2"
        style={{
          borderColor: EVENT_COLORS[event.status],
          borderWidth: 2,
          marginTop: 1,
          marginBottom: 1,
        }}>
        <Text numberOfLines={1} className="text-[12px] font-bold text-textPrimary">
          {event.petName}
        </Text>

        <Text numberOfLines={1} className="text-[10px] text-textPrimary opacity-90">
          {event.serviceName}
        </Text>

        <Text numberOfLines={1} className="mb-1 text-[10px] text-textPrimary opacity-80">
          {format(event.start, 'HH:mm')} – {format(event.end, 'HH:mm')}
        </Text>
      </View>
    </View>
  );
};
