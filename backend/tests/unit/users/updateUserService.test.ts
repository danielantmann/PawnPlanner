import { describe, it, expect } from 'vitest';
import { UpdateUserService } from '../../../application/users/services/UpdateUserService';
import { User } from '../../../core/users/domain/User';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('UpdateUserService', () => {
  it('should update user successfully', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';

    const mockRepo = {
      findById: async () => user,
      update: async (id: number, data: Partial<User>) => ({ ...user, ...data }), // usar update
    } as any;

    const service = new UpdateUserService(mockRepo);

    const result = await service.execute(1, { firstName: 'Daniel' });
    expect(result.firstName).toBe('Daniel');
  });

  it('should throw NotFoundError if user not found', async () => {
    const mockRepo = {
      findById: async () => null,
      update: async () => null,
    } as any;
    const service = new UpdateUserService(mockRepo);

    await expect(service.execute(999, { firstName: 'Daniel' })).rejects.toThrow(NotFoundError);
  });

  it('should throw error if repo fails to update', async () => {
    const user = new User();
    user.id = 1;

    const mockRepo = {
      findById: async () => user,
      update: async () => {
        throw new Error('DB error');
      },
    } as any;

    const service = new UpdateUserService(mockRepo);

    await expect(service.execute(1, { firstName: 'Daniel' })).rejects.toThrow(Error);
  });
});
