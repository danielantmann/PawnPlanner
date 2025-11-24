import { describe, it, expect, vi } from 'vitest';
import { GetOwnerByNameService } from '../../../application/owners/services/GetOwnerByNameService';

describe('GetOwnerByNameService', () => {
  const mockRepo = { findByName: vi.fn() };
  const service = new GetOwnerByNameService(mockRepo as any);

  it('should return owners by name', async () => {
    mockRepo.findByName.mockResolvedValue([{ id: 1, name: 'Daniel', pets: [] }]);
    const result = await service.execute('Daniel');
    expect(result[0].name).toBe('Daniel');
  });

  it('should return empty array if no owners found', async () => {
    mockRepo.findByName.mockResolvedValue([]);
    const result = await service.execute('Ghost');
    expect(result).toEqual([]);
  });
});
