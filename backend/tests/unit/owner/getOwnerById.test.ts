import { describe, it, expect, vi } from 'vitest';
import { GetOwnerByIdService } from '../../../application/owners/services/GetOwnerByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('GetOwnerByIdService', () => {
  const mockRepo = { findById: vi.fn() };
  const service = new GetOwnerByIdService(mockRepo as any);

  it('should return owner by id', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1, name: 'Daniel' });
    const result = await service.execute(1);
    expect(result.id).toBe(1);
  });

  it('should throw NotFoundError if owner not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.execute(99)).rejects.toThrow(NotFoundError);
  });
});
