import { describe, it, expect, vi } from 'vitest';
import { DeleteOwnerService } from '../../../application/owners/services/DeleteOwnerService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('DeleteOwnerService', () => {
  const mockRepo = { delete: vi.fn() };
  const service = new DeleteOwnerService(mockRepo as any);

  it('should delete owner successfully', async () => {
    mockRepo.delete.mockResolvedValue(true);
    const result = await service.execute(1);
    expect(result).toBeUndefined(); // porque execute devuelve void
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundError if owner does not exist', async () => {
    mockRepo.delete.mockResolvedValue(false);
    await expect(service.execute(99)).rejects.toThrow(NotFoundError);
  });
});
