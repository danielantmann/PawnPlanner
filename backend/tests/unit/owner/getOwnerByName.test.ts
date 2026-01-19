import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetOwnerByNameService } from '../../../application/owners/services/GetOwnerByNameService';
import { Owner } from '../../../core/owners/domain/Owner';

describe('GetOwnerByNameService', () => {
  const mockOwnerRepo = { findByName: vi.fn() };
  const mockPetRepo = { findByOwner: vi.fn() };
  const service = new GetOwnerByNameService(mockOwnerRepo as any, mockPetRepo as any);
  const userId = 1;

  it('should return owners by name', async () => {
    const owner = new Owner(1, 'Daniel', 'daniel', 'dan@test.com', '1234567', userId);
    mockOwnerRepo.findByName.mockResolvedValue([owner]);
    mockPetRepo.findByOwner.mockResolvedValue([]);

    const result = await service.execute('Daniel', userId);

    expect(result[0].name).toBe('Daniel');
    expect(result[0].pets).toEqual([]);
    expect(mockOwnerRepo.findByName).toHaveBeenCalledWith('Daniel', userId);
  });

  it('should return empty array if no owners found', async () => {
    mockOwnerRepo.findByName.mockResolvedValue([]);

    const result = await service.execute('Ghost', userId);

    expect(result).toEqual([]);
    expect(mockOwnerRepo.findByName).toHaveBeenCalledWith('Ghost', userId);
  });
});
