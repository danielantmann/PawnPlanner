import { renderHook } from '@testing-library/react-native';
import { useHomeAppointments } from '../../hooks/useHomeAppointments';
import { useAppointments } from '../../hooks/useAppointments';
import i18n from '@/src/i18n';

jest.mock('../../hooks/useAppointments');

const fixedDate = new Date(Date.UTC(2025, 1, 19, 12, 0, 0));

describe('useHomeAppointments', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('calls useAppointments with correct UTC start and end of day', () => {
    (useAppointments as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderHook(() => useHomeAppointments());

    const expectedStart = new Date(Date.UTC(2025, 1, 19, 0, 0, 0, 0)).toISOString();
    const expectedEnd = new Date(Date.UTC(2025, 1, 19, 23, 59, 59, 999)).toISOString();

    expect(useAppointments).toHaveBeenCalledWith({
      start: expectedStart,
      end: expectedEnd,
    });
  });

  it('maps appointments correctly into MiniAppointmentCardProps', () => {
    const startTime = '2025-02-19T10:30:00.000Z';

    (useAppointments as jest.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          petName: 'Luna',
          ownerName: 'Carlos',
          ownerPhone: '123',
          serviceName: 'Baño',
          startTime,
          endTime: '2025-02-19T11:00:00.000Z',
          status: 'completed',
          petId: 1,
          serviceId: 2,
          estimatedPrice: 20,
        },
      ],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useHomeAppointments());

    const expectedTime = new Date(startTime).toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });

    expect(result.current.mappedAppointments).toEqual([
      {
        id: 1,
        petName: 'Luna',
        ownerName: 'Carlos',
        serviceName: 'Baño',
        time: expectedTime,
        status: 'completed',
      },
    ]);
  });

  it('returns empty array when no appointments exist', () => {
    (useAppointments as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useHomeAppointments());

    expect(result.current.mappedAppointments).toEqual([]);
  });
});
