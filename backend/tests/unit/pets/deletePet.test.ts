import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { DeletePetService } from '../../../application/pets/services/DeletePetService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Pet } from '../../../core/pets/domain/Pet';

describe('DeletePetService', () => {
  const mockPetRepo = { findById: vi.fn(), delete: vi.fn() };
  const service = new DeletePetService(mockPetRepo as any);
  const userId = 1;

  it('should delete pet successfully', async () => {
    const pet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );

    mockPetRepo.findById.mockResolvedValue(pet);
    mockPetRepo.delete.mockResolvedValue(undefined);

    await service.execute(1, userId);

    expect(mockPetRepo.findById).toHaveBeenCalledWith(1, userId);
    expect(mockPetRepo.delete).toHaveBeenCalledWith(1, userId);
  });

  it('should throw NotFoundError if pet does not exist', async () => {
    mockPetRepo.findById.mockResolvedValue(null);

    await expect(service.execute(99, userId)).rejects.toThrow(NotFoundError);
    expect(mockPetRepo.delete).not.toHaveBeenCalled();
  });

  it('should verify pet exists before attempting deletion', async () => {
    const pet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );

    mockPetRepo.findById.mockResolvedValue(pet);
    mockPetRepo.delete.mockResolvedValue(undefined);

    await service.execute(1, userId);

    expect(mockPetRepo.findById).toHaveBeenCalledBefore(mockPetRepo.delete as any);
  });

  it('should pass correct userId to repository methods', async () => {
    const petId = 5;
    const userId2 = 42;
    const pet = new Pet(
      petId,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId2
    );

    mockPetRepo.findById.mockResolvedValue(pet);
    mockPetRepo.delete.mockResolvedValue(undefined);

    await service.execute(petId, userId2);

    expect(mockPetRepo.findById).toHaveBeenCalledWith(petId, userId2);
    expect(mockPetRepo.delete).toHaveBeenCalledWith(petId, userId2);
  });

  it('should handle deletion of pet with different attributes', async () => {
    const pet = new Pet(99, 'Max', 'max', null, 'needs insulin', 'calm dog', 10, 5, userId);

    mockPetRepo.findById.mockResolvedValue(pet);
    mockPetRepo.delete.mockResolvedValue(undefined);

    await service.execute(99, userId);

    expect(mockPetRepo.delete).toHaveBeenCalledWith(99, userId);
  });
});
