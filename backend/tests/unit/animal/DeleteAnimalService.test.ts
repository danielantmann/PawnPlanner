import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { DeleteAnimalService } from '../../../application/animals/services/DeleteAnimalService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

function mockRepo() {
  return {
    delete: vi.fn(),
  };
}

describe('DeleteAnimalService (unit)', () => {
  it('should delete an animal', async () => {
    const repo = mockRepo();
    const service = new DeleteAnimalService(repo as any);

    repo.delete.mockResolvedValue(true);

    await expect(service.execute(1, 10)).resolves.not.toThrow();
  });

  it('should throw NotFoundError if delete fails', async () => {
    const repo = mockRepo();
    const service = new DeleteAnimalService(repo as any);

    repo.delete.mockResolvedValue(false);

    await expect(service.execute(1, 10)).rejects.toThrow(NotFoundError);
  });
});
