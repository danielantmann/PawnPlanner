import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetAllServicesService } from '../../../application/services/services/GetAllServicesService';

describe('GetAllServicesService (unit)', () => {
  const mockRepo = {
    findAll: vi.fn(),
  };

  const service = new GetAllServicesService(mockRepo as any);

  it('should return services', async () => {
    mockRepo.findAll.mockResolvedValue([{ id: 1, name: 'Corte', price: 20, userId: 10 }]);

    const result = await service.execute(10);

    expect(result.length).toBe(1);
  });

  it('should return empty array if no services', async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await service.execute(10);

    expect(result).toEqual([]);
  });
});
