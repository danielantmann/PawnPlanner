import { describe, it, expect, vi } from 'vitest';
import { UpdateOwnerService } from '../../../application/owners/services/UpdateOwnerService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { Owner } from '../../../core/owners/domain/Owner';

describe('UpdateOwnerService', () => {
  const mockRepo = {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByPhone: vi.fn(),
    update: vi.fn(),
  };

  const service = new UpdateOwnerService(mockRepo as any);
  const userId = 1;

  it('should update owner successfully', async () => {
    const existingOwner = new Owner();
    Object.assign(existingOwner, {
      id: 1,
      name: 'Daniel',
      email: 'dan@test.com',
      phone: '123',
      userId,
      pets: [],
    });

    const updatedOwner = new Owner();
    Object.assign(updatedOwner, {
      id: 1,
      name: 'Daniel Updated',
      email: 'dan@test.com',
      phone: '456',
      userId,
      pets: [],
    });

    mockRepo.findById.mockResolvedValue(existingOwner);
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByPhone.mockResolvedValue(null);
    mockRepo.update.mockResolvedValue(updatedOwner);

    const result = await service.execute(1, { name: 'Daniel Updated', phone: '456' }, userId);

    expect(mockRepo.update).toHaveBeenCalledWith(1, expect.any(Owner), userId);

    expect(result).toEqual({
      id: 1,
      name: 'Daniel Updated',
      email: 'dan@test.com',
      phone: '456',
      pets: [],
    });
  });

  it('should throw NotFoundError if owner does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute(99, { name: 'Ghost' }, userId)).rejects.toThrow(NotFoundError);
  });

  it('should throw ConflictError if email already exists', async () => {
    const owner = new Owner();
    Object.assign(owner, { id: 1, email: 'dan@test.com', userId });

    mockRepo.findById.mockResolvedValue(owner);
    mockRepo.findByEmail.mockResolvedValue({ id: 2 });

    await expect(service.execute(1, { email: 'other@test.com' }, userId)).rejects.toThrow(
      ConflictError
    );
  });

  it('should throw ConflictError if phone already exists', async () => {
    const owner = new Owner();
    Object.assign(owner, { id: 1, phone: '123', userId });

    mockRepo.findById.mockResolvedValue(owner);
    mockRepo.findByPhone.mockResolvedValue({ id: 2 });

    await expect(service.execute(1, { phone: '999' }, userId)).rejects.toThrow(ConflictError);
  });
});
