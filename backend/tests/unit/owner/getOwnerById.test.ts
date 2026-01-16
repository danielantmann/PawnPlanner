import { describe, it, expect, vi } from 'vitest';
import { GetOwnerByIdService } from '../../../application/owners/services/GetOwnerByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('GetOwnerByIdService', () => {
  const mockRepo = { findById: vi.fn() };
  const service = new GetOwnerByIdService(mockRepo as any);
  const userId = 1;

  it('should return owner by id', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1, name: 'Daniel', userId });

    const result = await service.execute(1, userId);

    expect(result.id).toBe(1);
    expect(mockRepo.findById).toHaveBeenCalledWith(1, userId);
  });

  it('should throw NotFoundError if owner not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute(99, userId)).rejects.toThrow(NotFoundError);
  });
});
