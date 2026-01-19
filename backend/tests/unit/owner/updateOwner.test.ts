import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { UpdateOwnerService } from '../../../application/owners/services/UpdateOwnerService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { Owner } from '../../../core/owners/domain/Owner';

describe('UpdateOwnerService', () => {
  const mockOwnerRepo = {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByPhone: vi.fn(),
    update: vi.fn(),
  };

  const mockPetRepo = {
    findByOwner: vi.fn(),
  };

  const service = new UpdateOwnerService(mockOwnerRepo as any, mockPetRepo as any);
  const userId = 1;

  it('should update owner successfully', async () => {
    const existingOwner = new Owner(1, 'Daniel', 'daniel', 'dan@test.com', '123', userId);
    const updatedOwner = new Owner(
      1,
      'Daniel Updated',
      'daniel updated',
      'dan@test.com',
      '456',
      userId
    );

    mockOwnerRepo.findById.mockResolvedValue(existingOwner);
    mockOwnerRepo.findByEmail.mockResolvedValue(null);
    mockOwnerRepo.findByPhone.mockResolvedValue(null);
    mockOwnerRepo.update.mockResolvedValue(updatedOwner);
    mockPetRepo.findByOwner.mockResolvedValue([]);

    const result = await service.execute(1, { name: 'Daniel Updated', phone: '456' }, userId);

    expect(mockOwnerRepo.update).toHaveBeenCalledWith(1, expect.any(Owner), userId);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Daniel Updated');
    expect(result.pets).toEqual([]);
  });

  it('should throw NotFoundError if owner does not exist', async () => {
    mockOwnerRepo.findById.mockResolvedValue(null);

    await expect(service.execute(99, { name: 'Ghost' }, userId)).rejects.toThrow(NotFoundError);
  });

  it('should throw ConflictError if email already exists', async () => {
    const owner = new Owner(1, 'Daniel', 'daniel', 'dan@test.com', '123', userId);

    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockOwnerRepo.findByEmail.mockResolvedValue(
      new Owner(2, 'Other', 'other', 'other@test.com', '999', userId)
    );

    await expect(service.execute(1, { email: 'other@test.com' }, userId)).rejects.toThrow(
      ConflictError
    );
  });

  it('should throw ConflictError if phone already exists', async () => {
    const owner = new Owner(1, 'Daniel', 'daniel', 'dan@test.com', '123', userId);

    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockOwnerRepo.findByPhone.mockResolvedValue(
      new Owner(2, 'Other', 'other', 'other@test.com', '999', userId)
    );

    await expect(service.execute(1, { phone: '999' }, userId)).rejects.toThrow(ConflictError);
  });
});
