import { describe, it, expect, vi } from 'vitest';
import { UpdateAnimalService } from '../../../application/animals/services/UpdateAnimalService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

function mockRepo() {
  return {
    update: vi.fn(),
  };
}

describe('UpdateAnimalService (unit)', () => {
  it('should update an animal', async () => {
    const repo = mockRepo();
    const service = new UpdateAnimalService(repo as any);

    repo.update.mockResolvedValue({
      id: 1,
      species: 'wolf',
      breeds: [],
    });

    const result = await service.execute(1, { species: 'Wolf' }, 10);

    expect(repo.update).toHaveBeenCalledWith(1, { species: 'wolf' }, 10);

    expect(result.species).toBe('Wolf');
  });

  it('should throw NotFoundError if update fails', async () => {
    const repo = mockRepo();
    const service = new UpdateAnimalService(repo as any);

    repo.update.mockResolvedValue(null);

    await expect(service.execute(1, { species: 'Wolf' }, 10)).rejects.toThrow(NotFoundError);
  });
});
