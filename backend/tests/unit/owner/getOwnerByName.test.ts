import { describe, it, expect, vi } from 'vitest';
import { GetOwnerByNameService } from '../../../application/owners/services/GetOwnerByNameService';

describe('GetOwnerByNameService', () => {
  const mockRepo = { findByName: vi.fn() };
  const service = new GetOwnerByNameService(mockRepo as any);
  const userId = 1;

  it('should return owners by name', async () => {
    mockRepo.findByName.mockResolvedValue([{ id: 1, name: 'Daniel', pets: [], userId }]);

    const result = await service.execute('Daniel', userId);

    expect(result[0].name).toBe('Daniel');
    expect(mockRepo.findByName).toHaveBeenCalledWith('Daniel', userId);
  });

  it('should return empty array if no owners found', async () => {
    mockRepo.findByName.mockResolvedValue([]);

    const result = await service.execute('Ghost', userId);

    expect(result).toEqual([]);
    expect(mockRepo.findByName).toHaveBeenCalledWith('Ghost', userId);
  });
});
