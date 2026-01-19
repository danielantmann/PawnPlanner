import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { DeleteUserService } from '../../../application/users/services/DeleteUserService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('DeleteUserService', () => {
  it('should delete user successfully', async () => {
    const mockRepo = { delete: async () => true } as any;
    const service = new DeleteUserService(mockRepo);

    await expect(service.execute(1)).resolves.not.toThrow();
  });

  it('should throw NotFoundError if user not found', async () => {
    const mockRepo = { delete: async () => null } as any;
    const service = new DeleteUserService(mockRepo);

    await expect(service.execute(999)).rejects.toThrow(NotFoundError);
  });

  it('should throw error if repo fails to delete', async () => {
    const mockRepo = {
      delete: async () => {
        throw new Error('DB error');
      },
    } as any;
    const service = new DeleteUserService(mockRepo);

    await expect(service.execute(1)).rejects.toThrow(Error);
  });
});
