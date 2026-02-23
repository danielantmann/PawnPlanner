import { View } from 'react-native';
import { MonthSummaryCard } from '../EventCard/MonthSummaryCard';
import type { CalendarEvent } from '../../types/calendar-event.types';

export function renderMonthEvent(events: CalendarEvent[], setSelectedDate: any, setViewMode: any) {
  return (event: CalendarEvent, touchableOpacityProps: any) => {
    const dayEvents = events.filter(
      (e) =>
        e.start.toDateString() === event.start.toDateString() ||
        e.end.toDateString() === event.start.toDateString()
    );

    if (event.id === dayEvents[0]?.id) {
      return (
        <View className="w-full items-center pt-1">
          <MonthSummaryCard
            count={dayEvents.length}
            onPress={() => {
              setSelectedDate(event.start);
              setViewMode('day');
            }}
          />
        </View>
      );
    }

    return null;
  };
}
