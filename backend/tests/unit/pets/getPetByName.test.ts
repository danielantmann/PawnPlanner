import 'reflect-metadata';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetPetByNameService } from '../../../application/pets/services/GetPetByNameService';
import { Pet } from '../../../core/pets/domain/Pet';

describe('GetPetByNameService', () => {
  const mockPetRepo = { findByName: vi.fn() };
  const mockOwnerRepo = { findById: vi.fn() };
  const mockBreedRepo = { findById: vi.fn() };

  const service = new GetPetByNameService(
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

  it('should return pets matching the given name', async () => {
    const pets = [
      new Pet(1, 'Fluffy', 'fluffy', new Date(), null, null, 5, 3, userId),
      new Pet(2, 'Fluffy', 'fluffy', new Date(), null, null, 8, 2, userId),
    ];

    mockPetRepo.findByName.mockResolvedValue(pets);

    const result = await service.execute('Fluffy', userId);

    expect(mockPetRepo.findByName).toHaveBeenCalledWith('Fluffy', userId);
    expect(result).toHaveLength(2);
  });

  // ... tus otros tests siguen igual
});
