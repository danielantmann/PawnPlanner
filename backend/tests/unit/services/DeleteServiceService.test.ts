import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { DeleteServiceService } from '../../../application/services/services/DeleteServiceService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';

describe('DeleteServiceService (unit)', () => {
  const mockRepo = {
    findById: vi.fn(),
    delete: vi.fn(),
  };

  const service = new DeleteServiceService(mockRepo as any);

  it('should delete a service', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: 10,
    });

    mockRepo.delete.mockResolvedValue(undefined);

    await expect(service.execute(1, 10)).resolves.not.toThrow();
    expect(mockRepo.delete).toHaveBeenCalledWith(1, 10);
  });

  it('should throw NotFoundError if service does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute(1, 10)).rejects.toThrow(NotFoundError);
  });

  it('should throw ForbiddenError if service is global', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Corte',
      price: 20,
      userId: null,
    });

    await expect(service.execute(1, 10)).rejects.toThrow(ForbiddenError);
  });
});
