import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetAllBreedsService } from '../../../application/breeds/services/GetAllBreedsService';

function mockRepo() {
  return {
    findAll: vi.fn(),
  };
}

describe('GetAllBreedsService (unit)', () => {
  it('should return all breeds', async () => {
    const repo = mockRepo();
    const service = new GetAllBreedsService(repo as any);

    repo.findAll.mockResolvedValue([
      { id: 1, name: 'labrador', animal: { id: 10, species: 'dog' } },
      { id: 2, name: 'siamese', animal: { id: 20, species: 'cat' } },
    ]);

    const result = await service.execute(1);

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Labrador');
    expect(result[1].name).toBe('Siamese');
  });
});
