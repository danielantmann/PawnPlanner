import { describe, expect, it, vi } from 'vitest';
import { CreateOwnerService } from '../../../application/owners/services/CreateOwnerService';
import { ConflictError } from '../../../shared/errors/ConflictError';

describe('CreateOwnerService', () => {
  const mockRepo = {
    findByEmail: vi.fn(),
    findByPhone: vi.fn(),
    create: vi.fn(),
  };

  const service = new CreateOwnerService(mockRepo as any);

  it('should create owner successfully', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByPhone.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue({
      id: 1,
      name: 'Daniel',
      email: 'dan@test.com',
      phone: '123',
    });

    const result = await service.execute({ name: 'Daniel', email: 'dan@test.com', phone: '123' });
    expect(result.name).toBe('Daniel');
    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('should throw ConflictError if email exists', async () => {
    mockRepo.findByEmail.mockResolvedValue({ id: 2 });
    await expect(
      service.execute({ name: 'X', email: 'dan@test.com', phone: '123' })
    ).rejects.toThrow(ConflictError);
  });

  it('should throw ConflictError if phone exists', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByPhone.mockResolvedValue({ id: 3 });
    await expect(
      service.execute({ name: 'X', email: 'new@test.com', phone: '123' })
    ).rejects.toThrow(ConflictError);
  });

  it('should return a DTO with all expected fields', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByPhone.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue({
      id: 1,
      name: 'Daniel',
      email: 'dan@test.com',
      phone: '123',
      pets: [],
    });

    const result = await service.execute({ name: 'Daniel', email: 'dan@test.com', phone: '123' });

    expect(result).toEqual({
      id: 1,
      name: 'Daniel',
      email: 'dan@test.com',
      phone: '123',
      pets: [],
    });
  });

  it('should throw an error if DTO is missing required fields', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByPhone.mockResolvedValue(null);

    // DTO vacío
    await expect(service.execute({} as any)).rejects.toThrow();
  });

  it('should throw an error if email format is invalid', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByPhone.mockResolvedValue(null);

    await expect(
      service.execute({ name: 'Daniel', email: 'not-an-email', phone: '123' })
    ).rejects.toThrow();
  });
});
