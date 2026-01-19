import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetBreedByIdService } from '../../../application/breeds/services/GetBreedByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Breed } from '../../../core/breeds/domain/Breed';
import { Animal } from '../../../core/animals/domain/Animal';

function mockRepos() {
  return {
    breedRepo: {
      findById: vi.fn(),
    },
    animalRepo: {
      findById: vi.fn(),
    },
  };
}

describe('GetBreedByIdService (unit)', () => {
  it('should return a breed', async () => {
    const { breedRepo, animalRepo } = mockRepos();
    const service = new GetBreedByIdService(breedRepo as any, animalRepo as any);

    const breed = new Breed(1, 'labrador', 'labrador', 10, 1);
    const animal = new Animal(10, 'dog', 1);

    breedRepo.findById.mockResolvedValue(breed);
    animalRepo.findById.mockResolvedValue(animal);

    const result = await service.execute(1, 1);

    expect(result.id).toBe(1);
    expect(result.name).toBe('Labrador');
  });

  it('should throw NotFoundError if breed not found', async () => {
    const { breedRepo, animalRepo } = mockRepos();
    const service = new GetBreedByIdService(breedRepo as any, animalRepo as any);

    breedRepo.findById.mockResolvedValue(null);

    await expect(service.execute(1, 1)).rejects.toThrow(NotFoundError);
  });
});
