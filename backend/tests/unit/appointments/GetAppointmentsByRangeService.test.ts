import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { GetAppointmentsByRangeService } from '../../../application/appointments/services/GetAppointmentsByRangeService';
import { BadRequestError } from '../../../shared/errors/BadRequestError';

describe('GetAppointmentsByRangeService', () => {
  const mockRepo = {
    findByDateRange: vi.fn(),
  };

  const service = new GetAppointmentsByRangeService(mockRepo as any);
  const userId = 1;

  const mockAppointment = {
    id: 1,
    userId,
    petId: 1,
    petName: 'Michi',
    serviceId: 1,
    serviceName: 'Baño',
    estimatedPrice: 100,
    finalPrice: 100,
    ownerName: 'Juan',
    ownerPhone: '555',
    startTime: new Date('2026-01-25T10:00:00Z'),
    endTime: new Date('2026-01-25T11:00:00Z'),
    durationMinutes: 60,
    status: 'completed' as const,
  };

  it('should return appointments in date range', async () => {
    const startDate = '2026-01-25T00:00:00Z';
    const endDate = '2026-01-25T23:59:59Z';

    mockRepo.findByDateRange.mockResolvedValue([mockAppointment]);

    const result = await service.execute(startDate, endDate, userId);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
    expect(mockRepo.findByDateRange).toHaveBeenCalledWith(
      userId,
      new Date(startDate),
      new Date(endDate)
    );
  });

  it('should throw BadRequestError if start date is invalid', async () => {
    const startDate = 'invalid-date';
    const endDate = '2026-01-25T23:59:59Z';

    await expect(service.execute(startDate, endDate, userId)).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError if end date is invalid', async () => {
    const startDate = '2026-01-25T00:00:00Z';
    const endDate = 'invalid-date';

    await expect(service.execute(startDate, endDate, userId)).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError if start date is after end date', async () => {
    const startDate = '2026-01-25T23:59:59Z';
    const endDate = '2026-01-25T00:00:00Z';

    await expect(service.execute(startDate, endDate, userId)).rejects.toThrow(BadRequestError);
  });

  it('should return empty array if no appointments in range', async () => {
    const startDate = '2026-02-01T00:00:00Z';
    const endDate = '2026-02-01T23:59:59Z';

    mockRepo.findByDateRange.mockResolvedValue([]);

    const result = await service.execute(startDate, endDate, userId);

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  it('should respect user ID for multi-tenancy', async () => {
    const startDate = '2026-01-25T00:00:00Z';
    const endDate = '2026-01-25T23:59:59Z';
    const differentUserId = 2;

    mockRepo.findByDateRange.mockResolvedValue([]);

    await service.execute(startDate, endDate, differentUserId);

    expect(mockRepo.findByDateRange).toHaveBeenCalledWith(
      differentUserId,
      expect.any(Date),
      expect.any(Date)
    );
  });

  it('should return multiple appointments in range', async () => {
    const appointment2 = {
      ...mockAppointment,
      id: 2,
      startTime: new Date('2026-01-25T13:00:00Z'),
      endTime: new Date('2026-01-25T14:00:00Z'),
    };

    mockRepo.findByDateRange.mockResolvedValue([mockAppointment, appointment2]);

    const result = await service.execute('2026-01-25T00:00:00Z', '2026-01-25T23:59:59Z', userId);

    expect(result.length).toBe(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it('should map appointments to DTOs correctly', async () => {
    mockRepo.findByDateRange.mockResolvedValue([mockAppointment]);

    const result = await service.execute('2026-01-25T00:00:00Z', '2026-01-25T23:59:59Z', userId);

    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('petId');
    expect(result[0]).toHaveProperty('petName');
    expect(result[0]).toHaveProperty('serviceName');
    expect(result[0]).toHaveProperty('startTime');
  });
});
