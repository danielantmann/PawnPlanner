import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { CreateAnimalService } from '../../../application/animals/services/CreateAnimalService';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { Animal } from '../../../core/animals/domain/Animal';

function mockAnimalRepo() {
  return {
    findBySpecies: vi.fn(),
    create: vi.fn(),
  };
}

function mockBreedRepo() {
  return {
    findByAnimal: vi.fn(),
  };
}

describe('CreateAnimalService (unit)', () => {
  it('should create an animal successfully', async () => {
    const animalRepo = mockAnimalRepo();
    const breedRepo = mockBreedRepo();
    const service = new CreateAnimalService(animalRepo as any, breedRepo as any);

    animalRepo.findBySpecies.mockResolvedValue([]);
    animalRepo.create.mockImplementation(async (animal: Animal) => ({
      ...animal,
      id: 1,
    }));
    breedRepo.findByAnimal.mockResolvedValue([]);

    const dto = { species: 'Dog' };
    const result = await service.execute(dto, 10);

    expect(animalRepo.findBySpecies).toHaveBeenCalledWith('dog', 10);
    expect(result.id).toBe(1);
    expect(result.species).toBe('Dog'); // mapper capitaliza
  });

  it('should throw ConflictError if species already exists', async () => {
    const animalRepo = mockAnimalRepo();
    const breedRepo = mockBreedRepo();
    const service = new CreateAnimalService(animalRepo as any, breedRepo as any);

    animalRepo.findBySpecies.mockResolvedValue([{}]); // ya existe

    await expect(service.execute({ species: 'Dog' }, 10)).rejects.toThrow(ConflictError);
  });
});
