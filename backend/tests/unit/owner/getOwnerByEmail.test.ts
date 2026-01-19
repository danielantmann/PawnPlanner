import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetOwnerByEmailService } from '../../../application/owners/services/GetOwnerByEmailService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Owner } from '../../../core/owners/domain/Owner';

describe('GetOwnerByEmailService', () => {
  const mockOwnerRepo = { findByEmail: vi.fn() };
  const mockPetRepo = { findByOwner: vi.fn() };
  const service = new GetOwnerByEmailService(mockOwnerRepo as any, mockPetRepo as any);
  const userId = 1;

  it('should return owner by email', async () => {
    const owner = new Owner(1, 'Daniel', 'daniel', 'dan@test.com', '1234567', userId);
    mockOwnerRepo.findByEmail.mockResolvedValue(owner);
    mockPetRepo.findByOwner.mockResolvedValue([]);

    const result = await service.execute('dan@test.com', userId);

    expect(result.email).toBe('dan@test.com');
    expect(result.pets).toEqual([]);
    expect(mockOwnerRepo.findByEmail).toHaveBeenCalledWith('dan@test.com', userId);
  });

  it('should throw NotFoundError if owner not found', async () => {
    mockOwnerRepo.findByEmail.mockResolvedValue(null);

    await expect(service.execute('ghost@test.com', userId)).rejects.toThrow(NotFoundError);
  });
});
