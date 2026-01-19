import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { UpdateBreedService } from '../../../application/breeds/services/UpdateBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Breed } from '../../../core/breeds/domain/Breed';
import { Animal } from '../../../core/animals/domain/Animal';

function mockRepos() {
  return {
    breedRepo: {
      update: vi.fn(),
    },
    animalRepo: {
      findById: vi.fn(),
    },
  };
}

describe('UpdateBreedService (unit)', () => {
  it('should update a breed', async () => {
    const { breedRepo, animalRepo } = mockRepos();
    const service = new UpdateBreedService(breedRepo as any, animalRepo as any);

    const updatedBreed = new Breed(1, 'labrador', 'labrador', 10, 1);
    const animal = new Animal(10, 'dog', 1);

    breedRepo.update.mockResolvedValue(updatedBreed);
    animalRepo.findById.mockResolvedValue(animal);

    const result = await service.execute(1, { name: 'Labrador' }, 1);

    expect(result.id).toBe(1);
    expect(result.name).toBe('Labrador');
  });

  it('should throw NotFoundError if update fails', async () => {
    const { breedRepo, animalRepo } = mockRepos();
    const service = new UpdateBreedService(breedRepo as any, animalRepo as any);

    breedRepo.update.mockResolvedValue(null);

    await expect(service.execute(1, { name: 'Labrador' }, 1)).rejects.toThrow(NotFoundError);
  });
});
