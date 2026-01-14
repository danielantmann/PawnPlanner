import { LoginUserService } from '../../../application/auth/services/LoginUserService';
import { describe, expect, it } from 'vitest';
import { User } from '../../../core/users/domain/User';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';

describe('LoginUserService', () => {
  it('should login with valid credentials', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.passwordHash = await PasswordService.hash('password123');

    const mockRepo = { findByEmail: async () => user } as any;
    const service = new LoginUserService(mockRepo);

    const result = await service.execute({ email: 'test@example.com', password: 'password123' });

    expect(result.user).toBe(user);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should normalize email (case + spaces)', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.passwordHash = await PasswordService.hash('password123');

    const mockRepo = { findByEmail: async () => user } as any;
    const service = new LoginUserService(mockRepo);

    const result = await service.execute({
      email: '  TEST@EXAMPLE.COM  ',
      password: 'password123',
    });
    expect(result.user).toBe(user);
  });

  it('should throw UnauthorizedError if user not found', async () => {
    const mockRepo = { findByEmail: async () => null } as any;
    const service = new LoginUserService(mockRepo);

    await expect(
      service.execute({ email: 'notfound@example.com', password: 'password123' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if password is invalid', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.passwordHash = await PasswordService.hash('password123');

    const mockRepo = { findByEmail: async () => user } as any;
    const service = new LoginUserService(mockRepo);

    await expect(
      service.execute({ email: 'test@example.com', password: 'wrongpass' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if password is empty', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.passwordHash = await PasswordService.hash('password123');

    const mockRepo = { findByEmail: async () => user } as any;
    const service = new LoginUserService(mockRepo);

    await expect(service.execute({ email: 'test@example.com', password: '' })).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw UnauthorizedError if email is empty', async () => {
    const mockRepo = { findByEmail: async () => null } as any;
    const service = new LoginUserService(mockRepo);

    await expect(service.execute({ email: '', password: 'password123' })).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw UnauthorizedError if repo throws error', async () => {
    const mockRepo = {
      findByEmail: async () => {
        throw new Error('DB error');
      },
    } as any;
    const service = new LoginUserService(mockRepo);

    await expect(
      service.execute({ email: 'test@example.com', password: 'password123' })
    ).rejects.toThrow(Error);
  });
});
