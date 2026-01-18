import { describe, it, expect, vi } from 'vitest';
import { GetBreedByIdService } from '../../../application/breeds/services/GetBreedByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

function mockRepo() {
  return {
    findById: vi.fn(),
  };
}

describe('GetBreedByIdService (unit)', () => {
  it('should return a breed', async () => {
    const repo = mockRepo();
    const service = new GetBreedByIdService(repo as any);

    repo.findById.mockResolvedValue({
      id: 1,
      name: 'labrador',
      animal: { id: 10, species: 'dog' },
    });

    const result = await service.execute(1, 1);

    expect(result.id).toBe(1);
    expect(result.name).toBe('Labrador');
    expect(result.animal.species).toBe('Dog');
  });

  it('should throw NotFoundError if breed not found', async () => {
    const repo = mockRepo();
    const service = new GetBreedByIdService(repo as any);

    repo.findById.mockResolvedValue(null);

    await expect(service.execute(1, 1)).rejects.toThrow(NotFoundError);
  });
});
