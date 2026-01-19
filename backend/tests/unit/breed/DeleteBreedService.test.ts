import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { DeleteBreedService } from '../../../application/breeds/services/DeleteBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

function mockRepo() {
  return {
    delete: vi.fn(),
  };
}

describe('DeleteBreedService (unit)', () => {
  it('should delete a breed', async () => {
    const repo = mockRepo();
    const service = new DeleteBreedService(repo as any);

    repo.delete.mockResolvedValue(true);

    await expect(service.execute(1, 1)).resolves.not.toThrow();
  });

  it('should throw NotFoundError if delete fails', async () => {
    const repo = mockRepo();
    const service = new DeleteBreedService(repo as any);

    repo.delete.mockResolvedValue(false);

    await expect(service.execute(1, 1)).rejects.toThrow(NotFoundError);
  });
});
