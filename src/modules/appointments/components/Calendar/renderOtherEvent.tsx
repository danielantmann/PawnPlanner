import { View } from 'react-native';
import { EventCard } from '../EventCard/EventCard';
import { OverlapSummaryCard } from '../EventCard/OverlapSummaryCard';
import type { CalendarEvent } from '../../types/calendar-event.types';

export function renderOtherEvent({
  viewMode,
  events,
  handlePressEvent,
  setSelectedDate,
  setViewMode,
}: any) {
  return (event: CalendarEvent, touchableOpacityProps: any) => {
    const { key, style, ...rest } = touchableOpacityProps;

    if (viewMode === 'day') {
      return (
        <View key={key} {...rest} style={[style, { backgroundColor: 'transparent' }]}>
          <EventCard event={event} mode={viewMode} onPress={handlePressEvent} />
        </View>
      );
    }

    if ((viewMode === '3days' || viewMode === 'week') && event.id.startsWith('group-')) {
      return (
        <View
          key={key}
          {...rest}
          style={[
            style,
            {
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 0,
              marginHorizontal: 2,
              width: '95%',
            },
          ]}>
          <OverlapSummaryCard
            count={event.count ?? 2}
            start={event.start}
            end={event.end}
            isWeek={viewMode === 'week'}
            onPress={() => {
              setSelectedDate(event.start);
              setViewMode('day');
            }}
          />
        </View>
      );
    }

    return (
      <View key={key} {...rest} style={[style, { backgroundColor: 'transparent' }]}>
        <EventCard event={event} mode={viewMode} onPress={handlePressEvent} />
      </View>
    );
  };
}
