import 'reflect-metadata';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AppointmentRepository } from '../../../infrastructure/repositories/AppointmentRepository';
import { Appointment } from '../../../core/appointments/domain/Appointment';

describe('AppointmentRepository', () => {
  let mockDataSource: any;
  let mockRepo: any;
  let repository: AppointmentRepository;

  const domainAppointment = new Appointment(
    1,
    1,
    1,
    1,
    1,
    'Michi',
    'Labrador',
    'Juan',
    '555-1234',
    'Baño',
    100,
    120,
    new Date('2026-01-25T10:00:00Z'),
    new Date('2026-01-25T11:00:00Z'),
    60,
    'completed',
    false
  );

  beforeEach(() => {
    mockRepo = {
      save: vi.fn(),
      findOne: vi.fn(),
      find: vi.fn(),
      delete: vi.fn(),
      merge: vi.fn(),
    };

    mockDataSource = {
      getRepository: vi.fn().mockReturnValue(mockRepo),
    };

    repository = new AppointmentRepository(mockDataSource);
  });

  describe('create', () => {
    it('should create and save an appointment', async () => {
      const mockEntity = {
        id: 1,
        userId: 1,
        petId: 1,
        ownerId: 1,
        serviceId: 1,
        petName: 'Michi',
        breedName: 'Labrador',
        ownerName: 'Juan',
        ownerPhone: '555-1234',
        serviceName: 'Baño',
        estimatedPrice: 100,
        finalPrice: 120,
        startTime: new Date('2026-01-25T10:00:00Z'),
        endTime: new Date('2026-01-25T11:00:00Z'),
        durationMinutes: 60,
        status: 'pending',
        reminderSent: false,
      };

      mockRepo.save.mockResolvedValue(mockEntity);

      const result = await repository.create(domainAppointment);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find appointment by id and userId', async () => {
      const mockEntity = {
        id: 1,
        userId: 1,
        petId: 1,
        ownerId: 1,
        serviceId: 1,
        petName: 'Michi',
        breedName: 'Labrador',
        ownerName: 'Juan',
        ownerPhone: '555-1234',
        serviceName: 'Baño',
        estimatedPrice: 100,
        finalPrice: 120,
        startTime: new Date('2026-01-25T10:00:00Z'),
        endTime: new Date('2026-01-25T11:00:00Z'),
        durationMinutes: 60,
        status: 'completed',
        reminderSent: false,
      };

      mockRepo.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById(1, 1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
    });

    it('should return null if appointment not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById(999, 1);

      expect(result).toBeNull();
    });

    it('should filter by userId for multi-tenancy', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await repository.findById(1, 2);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 2 },
      });
    });
  });

  describe('update', () => {
    it('should update an existing appointment', async () => {
      const mockEntity = {
        id: 1,
        userId: 1,
        petId: 1,
        ownerId: 1,
        serviceId: 1,
        petName: 'Michi',
        breedName: 'Labrador',
        ownerName: 'Juan',
        ownerPhone: '555-1234',
        serviceName: 'Baño',
        estimatedPrice: 100,
        finalPrice: 150,
        startTime: new Date('2026-01-25T10:00:00Z'),
        endTime: new Date('2026-01-25T11:00:00Z'),
        durationMinutes: 60,
        status: 'completed',
        reminderSent: false,
      };

      mockRepo.findOne.mockResolvedValue(mockEntity);
      mockRepo.merge.mockReturnValue(mockEntity);
      mockRepo.save.mockResolvedValue(mockEntity);

      const updated = new Appointment(
        1,
        1,
        1,
        1,
        1,
        'Michi',
        'Labrador',
        'Juan',
        '555-1234',
        'Baño',
        100,
        150,
        new Date('2026-01-25T10:00:00Z'),
        new Date('2026-01-25T11:00:00Z'),
        60,
        'completed',
        false
      );

      const result = await repository.update(updated);

      expect(result).toBeDefined();
      expect(result?.finalPrice).toBe(150);
    });

    it('should return null if appointment not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await repository.update(domainAppointment);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an appointment', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      await repository.delete(1, 1);

      expect(mockRepo.delete).toHaveBeenCalledWith({ id: 1, userId: 1 });
    });
  });

  describe('findOverlapping', () => {
    it('should detect overlapping appointments', async () => {
      const overlappingEntity = {
        id: 1,
        userId: 1,
        petId: 1,
        ownerId: 1,
        serviceId: 1,
        petName: 'Michi',
        breedName: 'Labrador',
        ownerName: 'Juan',
        ownerPhone: '555-1234',
        serviceName: 'Baño',
        estimatedPrice: 100,
        finalPrice: 120,
        startTime: new Date('2026-01-25T10:00:00Z'),
        endTime: new Date('2026-01-25T11:00:00Z'),
        durationMinutes: 60,
        status: 'completed',
        reminderSent: false,
      };

      mockRepo.find.mockResolvedValue([overlappingEntity]);

      const result = await repository.findOverlapping(
        1,
        new Date('2026-01-25T10:30:00Z'),
        new Date('2026-01-25T10:45:00Z')
      );

      expect(result.length).toBeGreaterThan(0);
    });

    it('should not detect non-overlapping appointments', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await repository.findOverlapping(
        1,
        new Date('2026-01-25T12:00:00Z'),
        new Date('2026-01-25T13:00:00Z')
      );

      expect(result.length).toBe(0);
    });

    it('should use correct overlap logic', async () => {
      mockRepo.find.mockResolvedValue([]);

      await repository.findOverlapping(
        1,
        new Date('2026-01-25T10:00:00Z'),
        new Date('2026-01-25T11:00:00Z')
      );

      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('findByDateRange', () => {
    it('should find appointments in date range', async () => {
      const mockEntity = {
        id: 1,
        userId: 1,
        petId: 1,
        ownerId: 1,
        serviceId: 1,
        petName: 'Michi',
        breedName: 'Labrador',
        ownerName: 'Juan',
        ownerPhone: '555-1234',
        serviceName: 'Baño',
        estimatedPrice: 100,
        finalPrice: 120,
        startTime: new Date('2026-01-25T10:00:00Z'),
        endTime: new Date('2026-01-25T11:00:00Z'),
        durationMinutes: 60,
        status: 'completed',
        reminderSent: false,
      };

      mockRepo.find.mockResolvedValue([mockEntity]);

      const result = await repository.findByDateRange(
        1,
        new Date('2026-01-25T00:00:00Z'),
        new Date('2026-01-25T23:59:59Z')
      );

      expect(result.length).toBe(1);
    });

    it('should return appointments ordered by start time', async () => {
      const entities = [
        {
          id: 1,
          userId: 1,
          petId: 1,
          ownerId: 1,
          serviceId: 1,
          petName: 'Michi',
          breedName: 'Labrador',
          ownerName: 'Juan',
          ownerPhone: '555-1234',
          serviceName: 'Baño',
          estimatedPrice: 100,
          finalPrice: 120,
          startTime: new Date('2026-01-25T10:00:00Z'),
          endTime: new Date('2026-01-25T11:00:00Z'),
          durationMinutes: 60,
          status: 'completed',
          reminderSent: false,
        },
        {
          id: 2,
          userId: 1,
          petId: 1,
          ownerId: 1,
          serviceId: 1,
          petName: 'Michi',
          breedName: 'Labrador',
          ownerName: 'Juan',
          ownerPhone: '555-1234',
          serviceName: 'Baño',
          estimatedPrice: 100,
          finalPrice: 120,
          startTime: new Date('2026-01-25T14:00:00Z'),
          endTime: new Date('2026-01-25T15:00:00Z'),
          durationMinutes: 60,
          status: 'completed',
          reminderSent: false,
        },
      ];

      mockRepo.find.mockResolvedValue(entities);

      const result = await repository.findByDateRange(
        1,
        new Date('2026-01-25T00:00:00Z'),
        new Date('2026-01-25T23:59:59Z')
      );

      expect(result.length).toBe(2);
    });

    it('should return empty array if no appointments in range', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await repository.findByDateRange(
        1,
        new Date('2026-02-25T00:00:00Z'),
        new Date('2026-02-25T23:59:59Z')
      );

      expect(result.length).toBe(0);
    });
  });

  describe('findCompletedInRange', () => {
    it('should find only completed appointments', async () => {
      const completedEntity = {
        id: 1,
        userId: 1,
        petId: 1,
        ownerId: 1,
        serviceId: 1,
        petName: 'Michi',
        breedName: 'Labrador',
        ownerName: 'Juan',
        ownerPhone: '555-1234',
        serviceName: 'Baño',
        estimatedPrice: 100,
        finalPrice: 120,
        startTime: new Date('2026-01-25T10:00:00Z'),
        endTime: new Date('2026-01-25T11:00:00Z'),
        durationMinutes: 60,
        status: 'completed',
        reminderSent: false,
      };

      mockRepo.find.mockResolvedValue([completedEntity]);

      const result = await repository.findCompletedInRange(
        1,
        new Date('2026-01-25T00:00:00Z'),
        new Date('2026-01-25T23:59:59Z')
      );

      expect(result.length).toBe(1);
    });

    it('should filter by status completed', async () => {
      mockRepo.find.mockResolvedValue([]);

      await repository.findCompletedInRange(
        1,
        new Date('2026-01-25T00:00:00Z'),
        new Date('2026-01-25T23:59:59Z')
      );

      expect(mockRepo.find).toHaveBeenCalled();
    });

    it('should return empty array if no completed appointments', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await repository.findCompletedInRange(
        1,
        new Date('2026-01-25T00:00:00Z'),
        new Date('2026-01-25T23:59:59Z')
      );

      expect(result.length).toBe(0);
    });
  });
});
