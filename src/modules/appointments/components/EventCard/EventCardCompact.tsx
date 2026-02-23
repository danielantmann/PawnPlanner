import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { CalendarEvent } from '../../types/calendar-event.types';
import { EVENT_COLORS } from '../../utils/eventColors';

interface Props {
  event: CalendarEvent;
  touchableOpacityProps?: TouchableOpacityProps;
}

export const EventCardCompact = ({ event, touchableOpacityProps }: Props) => {
  const border = EVENT_COLORS[event.status];

  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      className="justify-center overflow-hidden rounded-lg bg-background p-1"
      style={[touchableOpacityProps?.style, { borderColor: border, borderWidth: 1 }]}>
      <Text numberOfLines={1} className="text-[11px] font-semibold text-textPrimary">
        {event.petName}
      </Text>
    </TouchableOpacity>
  );
};
