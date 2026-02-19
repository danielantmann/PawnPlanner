import { Pressable, View } from 'react-native';
import { CalendarEvent } from '../../types/calendar-event.types';
import { EventCardFull } from './EventCardFull';
import { EventCardCompact } from './EventCardCompact';
import { EventCardPill } from './EventCardPill';

interface Props {
  event: CalendarEvent;
  mode: 'day' | '3days' | 'week' | 'month';
  onPress?: (event: CalendarEvent) => void;
  isCompressed?: boolean;
}

export const EventCard = ({ event, mode, onPress, isCompressed = false }: Props) => {
  const handlePress = () => {
    onPress?.(event);
  };

  const content = (() => {
    if (mode === 'day' || mode === '3days') {
      return <EventCardFull event={event} isCompressed={isCompressed} />;
    }

    if (mode === 'week') {
      return <EventCardCompact event={event} />;
    }

    return <EventCardPill event={event} />;
  })();

  return (
    <Pressable onPress={handlePress} style={{ flex: 1, width: '100%', height: '100%' }}>
      <View style={{ flex: 1, width: '100%', height: '100%' }}>{content}</View>
    </Pressable>
  );
};
