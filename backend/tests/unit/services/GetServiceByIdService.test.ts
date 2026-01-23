import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetServiceByIdService } from '../../../application/services/services/GetServiceByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('GetServiceByIdService (unit)', () => {
  const mockRepo = {
    findById: vi.fn(),
  };

  const service = new GetServiceByIdService(mockRepo as any);

  it('should return a service', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: 10,
    });

    const result = await service.execute(1, 10);

    expect(result.id).toBe(1);
  });

  it('should throw NotFoundError if not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute(1, 10)).rejects.toThrow(NotFoundError);
  });
});
