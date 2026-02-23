import { useAppointments } from '@/src/modules/appointments/hooks/useAppointments';
import i18n from '@/src/i18n';
import type { MiniAppointmentCardProps } from '@/src/modules/appointments/components/MiniAppointmentCard';

export function useHomeAppointments() {
  const locale = i18n.language;

  // USAR UTC CORRECTAMENTE
  const today = new Date();

  // Inicio del día (00:00:00)
  const start = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0)
  );

  // Final del día (23:59:59)
  const end = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999)
  );

  const startISO = start.toISOString();
  const endISO = end.toISOString();

  // HOOK REAL
  const {
    data: appointmentsData,
    isLoading,
    error,
  } = useAppointments({ start: startISO, end: endISO });

  // MAPEO DE CITAS CON MANEJO DE ERRORES
  const mappedAppointments: MiniAppointmentCardProps[] = (appointmentsData ?? [])
    .map((a) => {
      try {
        return {
          id: a.id,
          petName: a.petName,
          ownerName: a.ownerName,
          serviceName: a.serviceName,
          time: new Date(a.startTime).toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: a.status,
        };
      } catch (err) {
        console.error('Error mapping appointment:', a, err);
        return null;
      }
    })
    .filter(Boolean) as MiniAppointmentCardProps[];

  return {
    mappedAppointments,
    isLoading,
    error,
  };
}
