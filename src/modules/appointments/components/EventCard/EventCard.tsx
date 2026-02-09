import { Pressable } from 'react-native';
import { CalendarEvent } from '../../types/calendar-event.types';
import { EventCardFull } from './EventCardFull';
import { EventCardCompact } from './EventCardCompact';
import { EventCardPill } from './EventCardPill';

interface Props {
  event: CalendarEvent;
  mode: 'day' | '3days' | 'week' | 'month';
  onPress?: (event: CalendarEvent) => void;
}

export const EventCard = ({ event, mode, onPress }: Props) => {
  const handlePress = () => {
    onPress?.(event);
  };

  const content = (() => {
    if (mode === 'day' || mode === '3days') {
      return <EventCardFull event={event} />;
    }

    if (mode === 'week') {
      return <EventCardCompact event={event} />;
    }

    return <EventCardPill event={event} />;
  })();

  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }}>
      {content}
    </Pressable>
  );
};
