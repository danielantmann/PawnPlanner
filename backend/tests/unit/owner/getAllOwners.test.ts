import { describe, it, expect, vi } from 'vitest';
import { GetAllOwnersService } from '../../../application/owners/services/GetAllOwnersService';

describe('GetAllOwnersService', () => {
  const mockRepo = { findAll: vi.fn() };
  const service = new GetAllOwnersService(mockRepo as any);

  it('should return all owners', async () => {
    mockRepo.findAll.mockResolvedValue([
      { id: 1, name: 'Daniel' },
      { id: 2, name: 'Ana' },
    ]);
    const result = await service.execute();
    expect(result.length).toBe(2);
  });

  it('should return empty array if no owners exist', async () => {
    mockRepo.findAll.mockResolvedValue([]);
    const result = await service.execute();
    expect(result).toEqual([]);
  });
});
