import { describe, it, expect, vi } from 'vitest';
import { CreateAnimalService } from '../../../application/animals/services/CreateAnimalService';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { Animal } from '../../../core/animals/domain/Animal';

function mockRepo() {
  return {
    findBySpecies: vi.fn(),
    create: vi.fn(),
  };
}

describe('CreateAnimalService (unit)', () => {
  it('should create an animal successfully', async () => {
    const repo = mockRepo();
    const service = new CreateAnimalService(repo as any);

    repo.findBySpecies.mockResolvedValue([]);
    repo.create.mockImplementation(async (animal: Animal) => ({
      ...animal,
      id: 1,
      breeds: [],
    }));

    const dto = { species: 'Dog' };
    const result = await service.execute(dto, 10);

    expect(repo.findBySpecies).toHaveBeenCalledWith('dog', 10);
    expect(result.id).toBe(1);
    expect(result.species).toBe('Dog'); // mapper capitaliza
  });

  it('should throw ConflictError if species already exists', async () => {
    const repo = mockRepo();
    const service = new CreateAnimalService(repo as any);

    repo.findBySpecies.mockResolvedValue([{}]); // ya existe

    await expect(service.execute({ species: 'Dog' }, 10)).rejects.toThrow(ConflictError);
  });
});
