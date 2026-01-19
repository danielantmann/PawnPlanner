import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { ChangePasswordService } from '../../../application/auth/services/ChangePasswordService';
import { User } from '../../../core/users/domain/User';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';

describe('ChangePasswordService', () => {
  it('should change password successfully with valid old password', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.passwordHash = await PasswordService.hash('oldpass');

    const mockRepo = {
      findById: async () => user,
      save: async () => user,
    } as any;

    const service = new ChangePasswordService(mockRepo);

    await service.execute({
      userId: 1,
      oldPassword: 'oldpass',
      newPassword: 'newpass123',
    });

    const valid = await PasswordService.compare('newpass123', user.passwordHash);
    expect(valid).toBe(true);
  });

  it('should throw UnauthorizedError if old password is wrong', async () => {
    const user = new User();
    user.id = 1;
    user.passwordHash = await PasswordService.hash('oldpass');

    const mockRepo = { findById: async () => user } as any;
    const service = new ChangePasswordService(mockRepo);

    await expect(
      service.execute({
        userId: 1,
        oldPassword: 'wrongpass',
        newPassword: 'newpass123',
      })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if user not found', async () => {
    const mockRepo = { findById: async () => null } as any;
    const service = new ChangePasswordService(mockRepo);

    await expect(
      service.execute({
        userId: 999,
        oldPassword: 'oldpass',
        newPassword: 'newpass123',
      })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw error if repo fails to save', async () => {
    const user = new User();
    user.id = 1;
    user.passwordHash = await PasswordService.hash('oldpass');

    const mockRepo = {
      findById: async () => user,
      save: async () => {
        throw new Error('DB error');
      },
    } as any;

    const service = new ChangePasswordService(mockRepo);

    await expect(
      service.execute({
        userId: 1,
        oldPassword: 'oldpass',
        newPassword: 'newpass123',
      })
    ).rejects.toThrow(Error);
  });
});
