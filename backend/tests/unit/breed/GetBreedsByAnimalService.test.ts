import { describe, it, expect, vi } from 'vitest';
import { GetBreedsByAnimalService } from '../../../application/breeds/services/GetBreedsByAnimalService';

function mockRepo() {
  return {
    findByAnimal: vi.fn(),
  };
}

describe('GetBreedsByAnimalService (unit)', () => {
  it('should return breeds by animal', async () => {
    const repo = mockRepo();
    const service = new GetBreedsByAnimalService(repo as any);

    repo.findByAnimal.mockResolvedValue([
      { id: 1, name: 'labrador', animal: { id: 10, species: 'dog' } },
    ]);

    const result = await service.execute(10, 1);

    expect(repo.findByAnimal).toHaveBeenCalledWith(10, 1);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Labrador');
  });
});
