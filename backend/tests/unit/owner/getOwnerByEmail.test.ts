import { describe, it, expect, vi } from 'vitest';
import { GetOwnerByEmailService } from '../../../application/owners/services/GetOwnerByEmailService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('GetOwnerByEmailService', () => {
  const mockRepo = { findByEmail: vi.fn() };
  const service = new GetOwnerByEmailService(mockRepo as any);
  const userId = 1;

  it('should return owner by email', async () => {
    mockRepo.findByEmail.mockResolvedValue({ id: 1, email: 'dan@test.com', userId });

    const result = await service.execute('dan@test.com', userId);

    expect(result.email).toBe('dan@test.com');
    expect(mockRepo.findByEmail).toHaveBeenCalledWith('dan@test.com', userId);
  });

  it('should throw NotFoundError if owner not found', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(service.execute('ghost@test.com', userId)).rejects.toThrow(NotFoundError);
  });
});
