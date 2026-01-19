import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetOwnerByIdService } from '../../../application/owners/services/GetOwnerByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Owner } from '../../../core/owners/domain/Owner';

describe('GetOwnerByIdService', () => {
  const mockOwnerRepo = { findById: vi.fn() };
  const mockPetRepo = { findByOwner: vi.fn() };
  const service = new GetOwnerByIdService(mockOwnerRepo as any, mockPetRepo as any);
  const userId = 1;

  it('should return owner by id', async () => {
    const owner = new Owner(1, 'Daniel', 'daniel', 'dan@test.com', '1234567', userId);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockPetRepo.findByOwner.mockResolvedValue([]);

    const result = await service.execute(1, userId);

    expect(result.id).toBe(1);
    expect(result.name).toBe('Daniel');
    expect(result.pets).toEqual([]);
    expect(mockOwnerRepo.findById).toHaveBeenCalledWith(1, userId);
  });

  it('should throw NotFoundError if owner not found', async () => {
    mockOwnerRepo.findById.mockResolvedValue(null);

    await expect(service.execute(99, userId)).rejects.toThrow(NotFoundError);
  });
});
