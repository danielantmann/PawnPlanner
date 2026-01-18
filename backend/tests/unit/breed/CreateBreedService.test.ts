import { describe, it, expect, vi } from 'vitest';
import { CreateBreedService } from '../../../application/breeds/services/CreateBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';

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

    animalRepo.findById.mockResolvedValue({
      id: 10,
      species: 'dog',
    });

    breedRepo.findByNameAndAnimal.mockResolvedValue(null);

    breedRepo.save.mockResolvedValue({
      id: 1,
      name: 'labrador',
      animal: { id: 10, species: 'dog' },
    });

    const result = await service.execute({ name: 'Labrador', animalId: 10 }, 1);

    expect(result.id).toBe(1);
    expect(result.name).toBe('Labrador');
    expect(result.animal.id).toBe(10);
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

    animalRepo.findById.mockResolvedValue({ id: 10 });

    breedRepo.findByNameAndAnimal.mockResolvedValue({ id: 99 });

    await expect(service.execute({ name: 'Labrador', animalId: 10 }, 1)).rejects.toThrow(
      ConflictError
    );
  });
});
