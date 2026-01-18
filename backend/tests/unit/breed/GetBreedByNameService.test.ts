import { describe, it, expect, vi } from 'vitest';
import { GetBreedByNameService } from '../../../application/breeds/services/GetBreedByNameService';

function mockRepo() {
  return {
    findByName: vi.fn(),
  };
}

describe('GetBreedByNameService (unit)', () => {
  it('should return breeds by name', async () => {
    const repo = mockRepo();
    const service = new GetBreedByNameService(repo as any);

    repo.findByName.mockResolvedValue([
      { id: 1, name: 'labrador', animal: { id: 10, species: 'dog' } },
    ]);

    const result = await service.execute('Labrador', 1);

    expect(repo.findByName).toHaveBeenCalledWith('Labrador', 1);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Labrador');
  });
});
