import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { CreateServiceService } from '../../../application/services/services/CreateServiceService';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';

describe('CreateServiceService (unit)', () => {
  const mockRepo = {
    create: vi.fn(),
  };

  const service = new CreateServiceService(mockRepo as any);

  it('should create a service', async () => {
    mockRepo.create.mockResolvedValue({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: 10,
    });

    const result = await service.execute({ name: 'Corte', price: 20 }, 10);

    expect(result).toEqual({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: 10,
    });
  });

  it('should throw BadRequestError if name is empty', async () => {
    await expect(service.execute({ name: '   ', price: 20 }, 10)).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError if price is negative', async () => {
    await expect(service.execute({ name: 'Corte', price: -5 }, 10)).rejects.toThrow(
      BadRequestError
    );
  });

  it('should throw ForbiddenError if userId is null (global service)', async () => {
    await expect(service.execute({ name: 'Corte', price: 20 }, null as any)).rejects.toThrow(
      ForbiddenError
    );
  });
});
