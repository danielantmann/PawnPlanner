import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { UpdateAppointmentService } from '../../../application/appointments/services/UpdateAppointmentService';
import { UpdateAppointmentDTO } from '../../../application/appointments/dto/UpdateAppointmentDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { ConflictError } from '../../../shared/errors/ConflictError';

describe('UpdateAppointmentService', () => {
  const mockAppointmentRepo = {
    findById: vi.fn(),
    update: vi.fn(),
    findOverlapping: vi.fn(),
  };

  const mockPetRepo = {
    findById: vi.fn(),
  };

  const mockOwnerRepo = {
    findById: vi.fn(),
  };

  const mockServiceRepo = {
    findById: vi.fn(),
  };

  const mockBreedRepo = {
    findById: vi.fn(),
  };

  const service = new UpdateAppointmentService(
    mockAppointmentRepo as any,
    mockPetRepo as any,
    mockOwnerRepo as any,
    mockServiceRepo as any,
    mockBreedRepo as any
  );

  const userId = 1;
  const appointmentId = 1;

  const existingAppointment = {
    id: appointmentId,
    userId,
    petId: 1,
    ownerId: 1,
    petName: 'Michi',
    breedName: 'Labrador',
    serviceId: 1,
    serviceName: 'Baño',
    estimatedPrice: 100,
    finalPrice: 100,
    ownerName: 'Juan',
    ownerPhone: '555',
    startTime: new Date('2026-01-25T10:00:00Z'),
    endTime: new Date('2026-01-25T11:00:00Z'),
    durationMinutes: 60,
    status: 'completed',
    reminderSent: false,
  };

  it('should update appointment with partial data', async () => {
    const updateDto: UpdateAppointmentDTO = { finalPrice: 150 };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);
    mockAppointmentRepo.update.mockResolvedValue({
      ...existingAppointment,
      finalPrice: 150,
    });

    const result = await service.execute(appointmentId, updateDto, userId);
    expect(result.finalPrice).toBe(150);
  });

  it('should throw NotFoundError if appointment not found', async () => {
    mockAppointmentRepo.findById.mockResolvedValue(null);
    await expect(service.execute(appointmentId, {}, userId)).rejects.toThrow(NotFoundError);
  });

  it('should update start and end times', async () => {
    const updateDto: UpdateAppointmentDTO = {
      startTime: '2026-01-25T14:00:00Z',
      endTime: '2026-01-25T15:00:00Z',
    };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);
    mockAppointmentRepo.findOverlapping.mockResolvedValue([]);
    mockAppointmentRepo.update.mockResolvedValue({
      ...existingAppointment,
      startTime: new Date(updateDto.startTime!),
      endTime: new Date(updateDto.endTime!),
      durationMinutes: 60,
    });

    const result = await service.execute(appointmentId, updateDto, userId);
    expect(result.startTime).toBe(new Date(updateDto.startTime!).toISOString());
    expect(result.endTime).toBe(new Date(updateDto.endTime!).toISOString());
  });

  it('should throw BadRequestError if new startTime >= endTime', async () => {
    const updateDto: UpdateAppointmentDTO = {
      startTime: '2026-01-25T15:00:00Z',
      endTime: '2026-01-25T14:00:00Z',
    };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);
    await expect(service.execute(appointmentId, updateDto, userId)).rejects.toThrow(
      BadRequestError
    );
  });

  it('should detect overlap when updating dates', async () => {
    const updateDto: UpdateAppointmentDTO = {
      startTime: '2026-01-25T10:30:00Z',
      endTime: '2026-01-25T11:30:00Z',
    };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);
    mockAppointmentRepo.findOverlapping.mockResolvedValue([
      {
        id: 2,
        startTime: new Date('2026-01-25T11:00:00Z'),
        endTime: new Date('2026-01-25T12:00:00Z'),
      },
    ]);

    await expect(service.execute(appointmentId, updateDto, userId)).rejects.toThrow(ConflictError);
  });

  it('should update pet and related data', async () => {
    const updateDto: UpdateAppointmentDTO = { petId: 2 };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);

    mockPetRepo.findById.mockResolvedValue({
      id: 2,
      name: 'Gato Nuevo',
      ownerId: 1,
      breedId: 10,
    });

    mockOwnerRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Nueva Dueña',
      phone: '999',
    });

    mockBreedRepo.findById.mockResolvedValue({
      id: 10,
      name: 'Labrador',
    });

    mockAppointmentRepo.update.mockResolvedValue({
      ...existingAppointment,
      petId: 2,
      petName: 'Gato Nuevo',
      breedName: 'Labrador',
      ownerName: 'Nueva Dueña',
      ownerPhone: '999',
    });

    const result = await service.execute(appointmentId, updateDto, userId);

    expect(result.petId).toBe(2);
  });

  it('should validate status values', async () => {
    const updateDto: UpdateAppointmentDTO = { status: 'invalid-status' as any };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);
    await expect(service.execute(appointmentId, updateDto, userId)).rejects.toThrow(
      BadRequestError
    );
  });

  it('should allow valid status transitions', async () => {
    const updateDto: UpdateAppointmentDTO = { status: 'no-show' };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);
    mockAppointmentRepo.update.mockResolvedValue({
      ...existingAppointment,
      status: 'no-show',
    });

    const result = await service.execute(appointmentId, updateDto, userId);
    expect(result.status).toBe('no-show');
  });

  it('should update finalPrice only', async () => {
    const updateDto: UpdateAppointmentDTO = { finalPrice: 200 };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);
    mockAppointmentRepo.update.mockResolvedValue({
      ...existingAppointment,
      finalPrice: 200,
    });

    const result = await service.execute(appointmentId, updateDto, userId);
    expect(result.finalPrice).toBe(200);
  });

  it('should recalculate duration when dates change', async () => {
    const updateDto: UpdateAppointmentDTO = {
      startTime: '2026-01-25T10:00:00Z',
      endTime: '2026-01-25T13:00:00Z',
    };

    mockAppointmentRepo.findById.mockResolvedValue(existingAppointment);
    mockAppointmentRepo.findOverlapping.mockResolvedValue([]);
    mockAppointmentRepo.update.mockResolvedValue({
      ...existingAppointment,
      startTime: new Date(updateDto.startTime!),
      endTime: new Date(updateDto.endTime!),
      durationMinutes: 180,
    });

    const result = await service.execute(appointmentId, updateDto, userId);
    expect(result.durationMinutes).toBe(180);
  });
});
