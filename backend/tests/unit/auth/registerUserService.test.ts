import { describe, it, expect } from 'vitest';
import { RegisterUserService } from '../../../application/auth/services/RegisterUserService';
import { User } from '../../../core/users/domain/User';
import { ConflictError } from '../../../shared/errors/ConflictError';

describe('RegisterUserService', () => {
  it('should register a new user successfully', async () => {
    const mockRepo = {
      findByEmail: async () => null,
      save: async (user: User) => user,
    } as any;

    const service = new RegisterUserService(mockRepo);

    const result = await service.execute({
      email: 'new@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(result.user.email).toBe('new@example.com');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should throw ConflictError if email already exists', async () => {
    const existingUser = new User();
    existingUser.email = 'exists@example.com';

    const mockRepo = {
      findByEmail: async () => existingUser,
      save: async () => existingUser, // mockear save aunque no se use
    } as any;

    const service = new RegisterUserService(mockRepo);

    await expect(
      service.execute({
        email: 'exists@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      })
    ).rejects.toThrow(ConflictError);
  });

  it('should throw error if repo fails to save', async () => {
    const mockRepo = {
      findByEmail: async () => null,
      save: async () => {
        throw new Error('DB error');
      },
    } as any;

    const service = new RegisterUserService(mockRepo);

    await expect(
      service.execute({
        email: 'fail@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Brown',
      })
    ).rejects.toThrow(Error);
  });
});
