import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetAllAnimalsService } from '../../../application/animals/services/GetAllAnimalsService';

function mockRepo() {
  return {
    findAll: vi.fn(),
  };
}

describe('GetAllAnimalsService (unit)', () => {
  it('should return all animals', async () => {
    const repo = mockRepo();
    const service = new GetAllAnimalsService(repo as any);

    repo.findAll.mockResolvedValue([
      { id: 1, species: 'dog', breeds: [] },
      { id: 2, species: 'cat', breeds: [] },
    ]);

    const result = await service.execute(10);

    expect(result.length).toBe(2);
    expect(result[0].species).toBe('Dog');
    expect(result[1].species).toBe('Cat');
  });
});
