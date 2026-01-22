import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { GetCompletedAppointmentsInRangeService } from '../../../application/appointments/services/GetCompletedAppointmentsInRangeService';
import { BadRequestError } from '../../../shared/errors/BadRequestError';

describe('GetCompletedAppointmentsInRangeService', () => {
  const mockRepo = {
    findCompletedInRange: vi.fn(),
  };

  const service = new GetCompletedAppointmentsInRangeService(mockRepo as any);
  const userId = 1;

  const completedAppointment = {
    id: 1,
    userId,
    petId: 1,
    petName: 'Michi',
    serviceId: 1,
    serviceName: 'Baño',
    estimatedPrice: 100,
    finalPrice: 120,
    ownerName: 'Juan',
    ownerPhone: '555',
    startTime: new Date('2026-01-25T10:00:00Z'),
    endTime: new Date('2026-01-25T11:00:00Z'),
    durationMinutes: 60,
    status: 'completed' as const,
  };

  it('should return completed appointments in date range', async () => {
    const startDate = '2026-01-25T00:00:00Z';
    const endDate = '2026-01-25T23:59:59Z';

    mockRepo.findCompletedInRange.mockResolvedValue([completedAppointment]);

    const result = await service.execute(startDate, endDate, userId);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].status).toBe('completed');
  });

  it('should only return completed appointments', async () => {
    // Service should filter out non-completed appointments
    mockRepo.findCompletedInRange.mockResolvedValue([completedAppointment]);

    const result = await service.execute('2026-01-25T00:00:00Z', '2026-01-25T23:59:59Z', userId);

    expect(result.every((a) => a.status === 'completed')).toBe(true);
  });

  it('should throw BadRequestError if dates are invalid', async () => {
    await expect(service.execute('invalid', '2026-01-25T23:59:59Z', userId)).rejects.toThrow(
      BadRequestError
    );
  });

  it('should throw BadRequestError if start date > end date', async () => {
    await expect(
      service.execute('2026-01-25T23:59:59Z', '2026-01-25T00:00:00Z', userId)
    ).rejects.toThrow(BadRequestError);
  });

  it('should return empty array if no completed appointments', async () => {
    mockRepo.findCompletedInRange.mockResolvedValue([]);

    const result = await service.execute('2026-01-25T00:00:00Z', '2026-01-25T23:59:59Z', userId);

    expect(result.length).toBe(0);
  });

  it('should respect user ID for multi-tenancy', async () => {
    const differentUserId = 2;
    mockRepo.findCompletedInRange.mockResolvedValue([]);

    await service.execute('2026-01-25T00:00:00Z', '2026-01-25T23:59:59Z', differentUserId);

    expect(mockRepo.findCompletedInRange).toHaveBeenCalledWith(
      differentUserId,
      expect.any(Date),
      expect.any(Date)
    );
  });

  it('should return multiple completed appointments', async () => {
    const appointment2 = {
      ...completedAppointment,
      id: 2,
      startTime: new Date('2026-01-25T13:00:00Z'),
      endTime: new Date('2026-01-25T14:00:00Z'),
    };

    mockRepo.findCompletedInRange.mockResolvedValue([completedAppointment, appointment2]);

    const result = await service.execute('2026-01-25T00:00:00Z', '2026-01-25T23:59:59Z', userId);

    expect(result.length).toBe(2);
  });
});
