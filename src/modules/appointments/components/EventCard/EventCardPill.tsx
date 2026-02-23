import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { CalendarEvent } from '../../types/calendar-event.types';
import { EVENT_COLORS } from '../../utils/eventColors';

interface Props {
  event: CalendarEvent;
  touchableOpacityProps?: TouchableOpacityProps;
}

export const EventCardPill = ({ event, touchableOpacityProps }: Props) => {
  const border = EVENT_COLORS[event.status];

  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      className="overflow-hidden rounded-md bg-background px-[4px] py-[2px]"
      style={[touchableOpacityProps?.style, { borderColor: border, borderWidth: 1 }]}>
      <Text numberOfLines={1} className="text-[10px] font-semibold text-textPrimary">
        {event.petName}
      </Text>
    </TouchableOpacity>
  );
};
