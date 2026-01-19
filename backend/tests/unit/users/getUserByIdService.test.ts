import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { GetUserByIdService } from '../../../application/users/services/GetUserByIdService';
import { User } from '../../../core/users/domain/User';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

describe('GetUserByIdService', () => {
  it('should return user if found', async () => {
    const user = new User();
    user.id = 1;
    user.firstName = 'john';
    user.lastName = 'doe';
    user.email = 'test@example.com';

    const mockRepo = { findById: async () => user } as any;
    const service = new GetUserByIdService(mockRepo);

    const result = await service.execute(1);
    expect(result.id).toBe(1);
    expect(result.email).toBe('test@example.com');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
  });

  it('should throw NotFoundError if user not found', async () => {
    const mockRepo = { findById: async () => null } as any;
    const service = new GetUserByIdService(mockRepo);

    await expect(service.execute(999)).rejects.toThrow(NotFoundError);
  });
});
