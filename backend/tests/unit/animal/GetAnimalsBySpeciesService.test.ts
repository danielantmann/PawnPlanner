import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetAnimalsBySpeciesService } from '../../../application/animals/services/GetAnimalsBySpeciesService';

function mockRepo() {
  return {
    findBySpecies: vi.fn(),
  };
}

describe('GetAnimalsBySpeciesService (unit)', () => {
  it('should return animals by species', async () => {
    const repo = mockRepo();
    const service = new GetAnimalsBySpeciesService(repo as any);

    repo.findBySpecies.mockResolvedValue([{ id: 1, species: 'dog', breeds: [] }]);

    const result = await service.execute('Dog', 10);

    expect(repo.findBySpecies).toHaveBeenCalledWith('dog', 10);
    expect(result.length).toBe(1);
    expect(result[0].species).toBe('Dog');
  });
});
