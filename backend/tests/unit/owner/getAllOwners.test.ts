import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetAllOwnersService } from '../../../application/owners/services/GetAllOwnersService';
import { Owner } from '../../../core/owners/domain/Owner';

describe('GetAllOwnersService', () => {
  const mockOwnerRepo = { findAll: vi.fn() };
  const mockPetRepo = { findByOwner: vi.fn() };
  const service = new GetAllOwnersService(mockOwnerRepo as any, mockPetRepo as any);
  const userId = 1;

  it('should return all owners', async () => {
    const owners = [
      new Owner(1, 'Daniel', 'daniel', 'dan@test.com', '1234567', userId),
      new Owner(2, 'Ana', 'ana', 'ana@test.com', '7654321', userId),
    ];
    mockOwnerRepo.findAll.mockResolvedValue(owners);
    mockPetRepo.findByOwner.mockResolvedValue([]);

    const result = await service.execute(userId);

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Daniel');
    expect(result[1].name).toBe('Ana');
    expect(mockOwnerRepo.findAll).toHaveBeenCalledWith(userId);
  });

  it('should return empty array if no owners exist', async () => {
    mockOwnerRepo.findAll.mockResolvedValue([]);

    const result = await service.execute(userId);

    expect(result).toEqual([]);
    expect(mockOwnerRepo.findAll).toHaveBeenCalledWith(userId);
  });
});
