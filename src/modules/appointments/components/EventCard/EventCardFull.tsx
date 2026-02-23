import { Text, View } from 'react-native';
import { format } from 'date-fns';
import { CalendarEvent } from '../../types/calendar-event.types';
import { EVENT_COLORS } from '../../utils/eventColors';

interface Props {
  event: CalendarEvent;
  isCompressed?: boolean;
}

export const EventCardFull = ({ event, isCompressed = false }: Props) => {
  return (
    <View
      className="flex-1 rounded-md bg-background"
      style={{
        borderColor: EVENT_COLORS[event.status],
        borderWidth: 2,
        paddingVertical: 4,
        paddingHorizontal: 6,
      }}>
      {isCompressed ? (
        <Text numberOfLines={1} className="text-[9px] font-bold text-textPrimary">
          {event.petName}
        </Text>
      ) : (
        <>
          <Text numberOfLines={1} className="text-[12px] font-bold text-textPrimary">
            {event.petName}
          </Text>

          <Text numberOfLines={1} className="text-[10px] text-textPrimary opacity-90">
            {event.serviceName}
          </Text>

          <Text numberOfLines={1} className="text-[10px] text-textPrimary opacity-80">
            {format(event.start, 'HH:mm')} – {format(event.end, 'HH:mm')}
          </Text>
        </>
      )}
    </View>
  );
};
