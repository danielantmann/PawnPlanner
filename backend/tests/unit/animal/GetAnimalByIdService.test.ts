import { describe, it, expect, vi } from 'vitest';
import { GetAnimalByIdService } from '../../../application/animals/services/GetAnimalByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

function mockRepo() {
  return {
    findById: vi.fn(),
  };
}

describe('GetAnimalByIdService (unit)', () => {
  it('should return an animal', async () => {
    const repo = mockRepo();
    const service = new GetAnimalByIdService(repo as any);

    repo.findById.mockResolvedValue({
      id: 1,
      species: 'dog',
      breeds: [],
    });

    const result = await service.execute(1, 10);

    expect(result.id).toBe(1);
    expect(result.species).toBe('Dog');
  });

  it('should throw NotFoundError if not found', async () => {
    const repo = mockRepo();
    const service = new GetAnimalByIdService(repo as any);

    repo.findById.mockResolvedValue(null);

    await expect(service.execute(1, 10)).rejects.toThrow(NotFoundError);
  });
});
