import 'reflect-metadata';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetPetByBreedService } from '../../../application/pets/services/GetPetByBreedService';
import { Pet } from '../../../core/pets/domain/Pet';

describe('GetPetByBreedService', () => {
  const mockPetRepo = { findByBreed: vi.fn() };
  const mockOwnerRepo = { findById: vi.fn() };
  const mockBreedRepo = { findById: vi.fn() };

  const service = new GetPetByBreedService(
    mockPetRepo as any,
    mockOwnerRepo as any,
    mockBreedRepo as any
  );

  const userId = 1;

  beforeEach(() => {
    vi.clearAllMocks();

    // Valores por defecto para evitar errores
    mockOwnerRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Owner',
      phone: '123',
    });

    mockBreedRepo.findById.mockResolvedValue({
      id: 1,
      name: 'labrador',
    });
  });

  it('should return pets matching the given breed', async () => {
    const breedId = 3;
    const pets = [
      new Pet(1, 'Fluffy', 'fluffy', new Date(), null, null, 5, breedId, userId),
      new Pet(2, 'Max', 'max', new Date(), null, null, 8, breedId, userId),
    ];

    mockPetRepo.findByBreed.mockResolvedValue(pets);

    const result = await service.execute(breedId, userId);

    expect(mockPetRepo.findByBreed).toHaveBeenCalledWith(breedId, userId);
    expect(result).toHaveLength(2);
  });

  // … tus otros tests siguen igual
});
