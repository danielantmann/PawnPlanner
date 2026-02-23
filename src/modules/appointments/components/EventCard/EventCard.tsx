import { Pressable, View } from 'react-native';
import { CalendarEvent } from '../../types/calendar-event.types';
import { EventCardFull } from './EventCardFull';
import { EventCardCompact } from './EventCardCompact';
import { EventCardPill } from './EventCardPill';

interface Props {
  event: CalendarEvent;
  mode: 'day' | '3days' | 'week' | 'month';
  onPress?: (event: CalendarEvent) => void;
  overlappingCount?: number;
}

export const EventCard = ({ event, mode, onPress, overlappingCount = 1 }: Props) => {
  const handlePress = () => {
    onPress?.(event);
  };

  let content;

  if (mode === 'day') {
    if (overlappingCount <= 4) {
      content = <EventCardFull event={event} isCompressed={false} />;
    } else {
      content = <EventCardCompact event={event} />;
    }
  } else if (mode === '3days' || mode === 'week') {
    if (overlappingCount === 1) {
      content = <EventCardFull event={event} isCompressed={false} />;
    } else if (overlappingCount === 2 || overlappingCount === 3) {
      content = <EventCardCompact event={event} />;
    } else {
      return null;
    }
  } else {
    content = <EventCardPill event={event} />;
  }

  return (
    <Pressable onPress={handlePress} style={{ flex: 1, width: '100%', height: '100%' }}>
      <View style={{ flex: 1, width: '100%', height: '100%' }}>{content}</View>
    </Pressable>
  );
};
