import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { UpdateServiceService } from '../../../application/services/services/UpdateServiceService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';

describe('UpdateServiceService (unit)', () => {
  const mockRepo = {
    findById: vi.fn(),
    update: vi.fn(),
  };

  const service = new UpdateServiceService(mockRepo as any);

  it('should update a service', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: 10,
    });

    mockRepo.update.mockResolvedValue({
      id: 1,
      name: 'Corte Premium',
      price: 25,
      userId: 10,
    });

    const result = await service.execute(1, { name: 'Corte Premium', price: 25 }, 10);

    expect(result.name).toBe('Corte Premium');
    expect(result.price).toBe(25);
  });

  it('should throw NotFoundError if service does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute(1, { name: 'X' }, 10)).rejects.toThrow(NotFoundError);
  });

  it('should throw ForbiddenError if service is global', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: null,
    });

    await expect(service.execute(1, { name: 'X' }, 10)).rejects.toThrow(ForbiddenError);
  });

  it('should throw BadRequestError if name is empty', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: 10,
    });

    await expect(service.execute(1, { name: '   ' }, 10)).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError if price is negative', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: 10,
    });

    await expect(service.execute(1, { price: -10 }, 10)).rejects.toThrow(BadRequestError);
  });
});
