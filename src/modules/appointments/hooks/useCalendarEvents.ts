import { useMemo } from 'react';
import type { CalendarEvent } from '../types/calendar-event.types';
import type { AppointmentDTO } from '../types/appointment.types';

export function useCalendarEvents(appointments: AppointmentDTO[] | undefined, viewMode: string) {
  return useMemo<CalendarEvent[]>(() => {
    const baseEvents = (appointments ?? []).map((apt) => ({
      id: apt.id.toString(),
      title: apt.petName,
      petName: apt.petName,
      serviceName: apt.serviceName,
      start: new Date(apt.startTime),
      end: new Date(apt.endTime),
      status: apt.status,
      appointmentData: apt,
    }));

    if (viewMode === '3days' || viewMode === 'week') {
      const processed: CalendarEvent[] = [];
      const processedIds = new Set<string>();

      baseEvents.forEach((event) => {
        if (processedIds.has(event.id)) return;

        const overlappingGroup = baseEvents.filter(
          (e) => e.start < event.end && e.end > event.start
        );

        if (overlappingGroup.length >= 2) {
          const sortedByStart = [...overlappingGroup].sort(
            (a, b) => a.start.getTime() - b.start.getTime()
          );
          const sortedByEnd = [...overlappingGroup].sort(
            (a, b) => b.end.getTime() - a.end.getTime()
          );

          processed.push({
            ...event,
            id: `group-${overlappingGroup
              .map((e) => e.id)
              .sort()
              .join(',')}`,
            start: sortedByStart[0].start,
            end: sortedByEnd[0].end,
            count: overlappingGroup.length,
          });

          overlappingGroup.forEach((e) => processedIds.add(e.id));
        } else {
          processed.push(event);
          processedIds.add(event.id);
        }
      });

      return processed;
    }

    return baseEvents;
  }, [appointments, viewMode]);
}
