import { describe, it, expect, vi } from 'vitest';
import { UpdateOwnerService } from '../../../application/owners/services/UpdateOwnerService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';

describe('UpdateOwnerService', () => {
  const mockRepo = {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByPhone: vi.fn(),
    save: vi.fn(),
  };
  const service = new UpdateOwnerService(mockRepo as any);

  it('should update owner successfully', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Daniel',
      email: 'dan@test.com',
      phone: '123',
    });
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByPhone.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue({
      id: 1,
      name: 'Daniel Updated',
      email: 'dan@test.com',
      phone: '456',
    });

    const result = await service.execute(1, { name: 'Daniel Updated', phone: '456' });
    expect(result.name).toBe('Daniel Updated');
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundError if owner does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.execute(99, { name: 'Ghost' })).rejects.toThrow(NotFoundError);
  });

  it('should throw ConflictError if email already exists', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1, email: 'dan@test.com' });
    mockRepo.findByEmail.mockResolvedValue({ id: 2 });
    await expect(service.execute(1, { email: 'other@test.com' })).rejects.toThrow(ConflictError);
  });

  it('should throw ConflictError if phone already exists', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1, phone: '123' });
    mockRepo.findByPhone.mockResolvedValue({ id: 2 });
    await expect(service.execute(1, { phone: '999' })).rejects.toThrow(ConflictError);
  });
});
