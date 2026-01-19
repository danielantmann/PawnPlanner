import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { CreateBreedService } from '../../../application/breeds/services/CreateBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { Animal } from '../../../core/animals/domain/Animal';
import { Breed } from '../../../core/breeds/domain/Breed';

function mockRepos() {
  return {
    breedRepo: {
      findByNameAndAnimal: vi.fn(),
      save: vi.fn(),
    },
    animalRepo: {
      findById: vi.fn(),
    },
  };
}

describe('CreateBreedService (unit)', () => {
  it('should create a breed successfully', async () => {
    const { breedRepo, animalRepo } = mockRepos();
    const service = new CreateBreedService(breedRepo as any, animalRepo as any);

    const animal = new Animal(10, 'dog', 1);
    animalRepo.findById.mockResolvedValue(animal);
    breedRepo.findByNameAndAnimal.mockResolvedValue(null);

    const savedBreed = new Breed(1, 'labrador', 'labrador', 10, 1);
    breedRepo.save.mockResolvedValue(savedBreed);

    const result = await service.execute({ name: 'Labrador', animalId: 10 }, 1);

    expect(result.id).toBe(1);
    expect(result.name).toBe('Labrador');
  });

  it('should throw NotFoundError if animal does not exist', async () => {
    const { breedRepo, animalRepo } = mockRepos();
    const service = new CreateBreedService(breedRepo as any, animalRepo as any);

    animalRepo.findById.mockResolvedValue(null);

    await expect(service.execute({ name: 'Labrador', animalId: 10 }, 1)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ConflictError if breed already exists', async () => {
    const { breedRepo, animalRepo } = mockRepos();
    const service = new CreateBreedService(breedRepo as any, animalRepo as any);

    const animal = new Animal(10, 'dog', 1);
    animalRepo.findById.mockResolvedValue(animal);

    const existingBreed = new Breed(1, 'labrador', 'labrador', 10, 1);
    breedRepo.findByNameAndAnimal.mockResolvedValue(existingBreed);

    await expect(service.execute({ name: 'Labrador', animalId: 10 }, 1)).rejects.toThrow(
      ConflictError
    );
  });
});
