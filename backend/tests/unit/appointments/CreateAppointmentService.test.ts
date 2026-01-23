import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { CreateAppointmentService } from '../../../application/appointments/services/CreateAppointmentService';
import { CreateAppointmentDTO } from '../../../application/appointments/dto/CreateAppointmentDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { Appointment } from '../../../core/appointments/domain/Appointment';

describe('CreateAppointmentService', () => {
  const mockPetRepo = { findById: vi.fn() };
  const mockOwnerRepo = { findById: vi.fn() };
  const mockServiceRepo = { findById: vi.fn() };
  const mockBreedRepo = { findById: vi.fn() };
  const mockAppointmentRepo = { create: vi.fn(), findOverlapping: vi.fn() };

  const service = new CreateAppointmentService(
    mockPetRepo as any,
    mockOwnerRepo as any,
    mockServiceRepo as any,
    mockBreedRepo as any,
    mockAppointmentRepo as any
  );

  const userId = 1;
  const startDate = '2026-01-25T10:00:00Z';
  const endDate = '2026-01-25T11:00:00Z';

  it('should create appointment successfully with all valid data', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: startDate,
      endTime: endDate,
      finalPrice: 150,
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, name: 'Michi', ownerId: 1, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1, name: 'Juan Pérez', phone: '555-1234' });
    mockBreedRepo.findById.mockResolvedValue({ id: 1, name: 'Labrador' });
    mockServiceRepo.findById.mockResolvedValue({ id: 1, name: 'Baño', price: 100 });
    mockAppointmentRepo.findOverlapping.mockResolvedValue([]);

    mockAppointmentRepo.create.mockResolvedValue({
      id: 1,
      userId,
      petId: 1,
      ownerId: 1,
      serviceId: 1,
      petName: 'Michi',
      breedName: 'Labrador',
      ownerName: 'Juan Pérez',
      ownerPhone: '555-1234',
      serviceName: 'Baño',
      estimatedPrice: 100,
      finalPrice: 150,
      startTime: new Date(startDate),
      endTime: new Date(endDate),
      durationMinutes: 60,
      status: 'completed',
      reminderSent: false,
    });

    const result = await service.execute(dto, userId);

    expect(result).toBeDefined();
    expect(result.petId).toBe(1);
    expect(result.finalPrice).toBe(150);
    expect(result.durationMinutes).toBe(60);
  });

  it('should use estimatedPrice when finalPrice is not provided', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: startDate,
      endTime: endDate,
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, name: 'Michi', ownerId: 1, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1, name: 'Juan', phone: '555' });
    mockBreedRepo.findById.mockResolvedValue({ id: 1, name: 'Labrador' });
    mockServiceRepo.findById.mockResolvedValue({ id: 1, name: 'Baño', price: 100 });
    mockAppointmentRepo.findOverlapping.mockResolvedValue([]);

    const domainAppointment = new Appointment(
      1,
      userId,
      1,
      1,
      1,
      'Michi',
      'Labrador',
      'Juan',
      '555',
      'Baño',
      100,
      100,
      new Date(startDate),
      new Date(endDate),
      60,
      'completed',
      false
    );

    mockAppointmentRepo.create.mockResolvedValue(domainAppointment);

    const result = await service.execute(dto, userId);
    expect(result.finalPrice).toBe(100);
  });

  it('should throw NotFoundError if pet not found', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 999,
      serviceId: 1,
      startTime: startDate,
      endTime: endDate,
    };

    mockPetRepo.findById.mockResolvedValue(null);

    await expect(service.execute(dto, userId)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError if owner not found', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: startDate,
      endTime: endDate,
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, ownerId: 999, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue(null);

    await expect(service.execute(dto, userId)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError if breed not found', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: startDate,
      endTime: endDate,
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, ownerId: 1, breedId: 999 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1 });
    mockBreedRepo.findById.mockResolvedValue(null);

    await expect(service.execute(dto, userId)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError if service not found', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 999,
      startTime: startDate,
      endTime: endDate,
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, ownerId: 1, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1 });
    mockBreedRepo.findById.mockResolvedValue({ id: 1 });
    mockServiceRepo.findById.mockResolvedValue(null);

    await expect(service.execute(dto, userId)).rejects.toThrow(NotFoundError);
  });

  it('should throw BadRequestError if startTime >= endTime', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: '2026-01-25T11:00:00Z',
      endTime: '2026-01-25T10:00:00Z',
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, ownerId: 1, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1 });
    mockBreedRepo.findById.mockResolvedValue({ id: 1 });
    mockServiceRepo.findById.mockResolvedValue({ id: 1, price: 100 });

    await expect(service.execute(dto, userId)).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError if dates are invalid', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: 'invalid-date',
      endTime: '2026-01-25T11:00:00Z',
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, ownerId: 1, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1 });
    mockBreedRepo.findById.mockResolvedValue({ id: 1 });
    mockServiceRepo.findById.mockResolvedValue({ id: 1, price: 100 });

    await expect(service.execute(dto, userId)).rejects.toThrow(BadRequestError);
  });

  it('should throw ConflictError if appointment overlaps', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: '2026-01-25T10:30:00Z',
      endTime: '2026-01-25T11:30:00Z',
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, ownerId: 1, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1 });
    mockBreedRepo.findById.mockResolvedValue({ id: 1 });
    mockServiceRepo.findById.mockResolvedValue({ id: 1, price: 100 });
    mockAppointmentRepo.findOverlapping.mockResolvedValue([
      {
        id: 1,
        startTime: new Date('2026-01-25T10:00:00Z'),
        endTime: new Date('2026-01-25T11:00:00Z'),
      } as any,
    ]);

    await expect(service.execute(dto, userId)).rejects.toThrow(ConflictError);
  });

  it('should throw BadRequestError if finalPrice is negative', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: startDate,
      endTime: endDate,
      finalPrice: -50,
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, ownerId: 1, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1 });
    mockBreedRepo.findById.mockResolvedValue({ id: 1 });
    mockServiceRepo.findById.mockResolvedValue({ id: 1, price: 100 });
    mockAppointmentRepo.findOverlapping.mockResolvedValue([]);

    await expect(service.execute(dto, userId)).rejects.toThrow(BadRequestError);
  });

  it('should calculate duration correctly', async () => {
    const dto: CreateAppointmentDTO = {
      petId: 1,
      serviceId: 1,
      startTime: '2026-01-25T10:00:00Z',
      endTime: '2026-01-25T12:30:00Z',
    };

    mockPetRepo.findById.mockResolvedValue({ id: 1, ownerId: 1, breedId: 1 });
    mockOwnerRepo.findById.mockResolvedValue({ id: 1 });
    mockBreedRepo.findById.mockResolvedValue({ id: 1 });
    mockServiceRepo.findById.mockResolvedValue({ id: 1, price: 100 });
    mockAppointmentRepo.findOverlapping.mockResolvedValue([]);

    const domainAppointment = new Appointment(
      1,
      userId,
      1,
      1,
      1,
      'Michi',
      'Labrador',
      'Juan',
      '555-1234',
      'Baño',
      100,
      100,
      new Date('2026-01-25T10:00:00Z'),
      new Date('2026-01-25T12:30:00Z'),
      150,
      'completed',
      false
    );

    mockAppointmentRepo.create.mockResolvedValue(domainAppointment);

    const result = await service.execute(dto, userId);
    expect(result.durationMinutes).toBe(150);
  });
});
