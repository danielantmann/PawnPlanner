import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { DeleteAppointmentService } from '../../../application/appointments/services/DeleteAppointmentService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('DeleteAppointmentService', () => {
  const mockRepo = {
    findById: vi.fn(),
    delete: vi.fn(),
  };

  const service = new DeleteAppointmentService(mockRepo as any);
  const userId = 1;
  const appointmentId = 1;

  it('should delete existing appointment', async () => {
    mockRepo.findById.mockResolvedValue({
      id: appointmentId,
      userId,
      petId: 1,
      serviceId: 1,
      startTime: new Date('2026-01-25T10:00:00Z'),
      endTime: new Date('2026-01-25T11:00:00Z'),
    });

    mockRepo.delete.mockResolvedValue(undefined);

    await expect(service.execute(appointmentId, userId)).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith(appointmentId, userId);
  });

  it('should throw NotFoundError if appointment does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute(appointmentId, userId)).rejects.toThrow(NotFoundError);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it('should verify ownership before deleting', async () => {
    const differentUserId = 2;
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute(appointmentId, differentUserId)).rejects.toThrow(NotFoundError);
  });

  it('should call repository delete with correct parameters', async () => {
    mockRepo.findById.mockResolvedValue({ id: appointmentId, userId });
    mockRepo.delete.mockResolvedValue(undefined);

    await service.execute(appointmentId, userId);

    expect(mockRepo.delete).toHaveBeenCalledWith(appointmentId, userId);
    expect(mockRepo.delete).toHaveBeenCalledTimes(1);
  });
});
