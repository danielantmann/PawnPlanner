import { describe, it, expect, vi } from 'vitest';
import { UpdateBreedService } from '../../../application/breeds/services/UpdateBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

function mockRepo() {
  return {
    update: vi.fn(),
  };
}

describe('UpdateBreedService (unit)', () => {
  it('should update a breed', async () => {
    const repo = mockRepo();
    const service = new UpdateBreedService(repo as any);

    repo.update.mockResolvedValue({
      id: 1,
      name: 'labrador',
      animal: { id: 10, species: 'dog' },
    });

    const result = await service.execute(1, { name: 'Labrador' }, 1);

    expect(repo.update).toHaveBeenCalledWith(1, { name: 'labrador' }, 1);

    expect(result.name).toBe('Labrador');
  });

  it('should throw NotFoundError if update fails', async () => {
    const repo = mockRepo();
    const service = new UpdateBreedService(repo as any);

    repo.update.mockResolvedValue(null);

    await expect(service.execute(1, { name: 'Labrador' }, 1)).rejects.toThrow(NotFoundError);
  });
});
