import { describe, it, expect } from 'vitest';
import { ResetPasswordService } from '../../../application/auth/services/ResetPasswordService';
import { User } from '../../../core/users/domain/User';
import { TokenService } from '../../../shared/utils/TokenService';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { PasswordService } from '../../../shared/utils/PasswordService';
import jwt from 'jsonwebtoken';

describe('ResetPasswordService', () => {
  it('should reset password for valid token', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.passwordHash = 'oldhash';

    const mockRepo = {
      findByEmail: async () => user,
      save: async () => user,
    } as any;

    const service = new ResetPasswordService(mockRepo);
    const resetToken = TokenService.generateResetToken({ email: 'test@example.com' });

    await service.execute({ resetToken, newPassword: 'newpass123' });

    const valid = await PasswordService.compare('newpass123', user.passwordHash);
    expect(valid).toBe(true);
  });

  it('should throw UnauthorizedError for invalid token', async () => {
    const mockRepo = { findByEmail: async () => null } as any;
    const service = new ResetPasswordService(mockRepo);

    await expect(
      service.execute({ resetToken: 'invalid', newPassword: 'newpass123' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if user no longer exists', async () => {
    const resetToken = TokenService.generateResetToken({ email: 'ghost@example.com' });
    const mockRepo = { findByEmail: async () => null } as any;
    const service = new ResetPasswordService(mockRepo);

    await expect(service.execute({ resetToken, newPassword: 'newpass123' })).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw UnauthorizedError if token is expired', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';

    const mockRepo = { findByEmail: async () => user, save: async () => user } as any;
    const service = new ResetPasswordService(mockRepo);

    // Generamos un token con expiración inmediata
    const expiredToken = jwt.sign(
      { email: 'test@example.com' },
      (TokenService as any).RESET_SECRET,
      { expiresIn: '1ms' }
    );

    // Esperamos unos milisegundos para que expire
    await new Promise((res) => setTimeout(res, 10));

    await expect(
      service.execute({ resetToken: expiredToken, newPassword: 'newpass123' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw error if repo fails to save', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';

    const mockRepo = {
      findByEmail: async () => user,
      save: async () => {
        throw new Error('DB error');
      },
    } as any;

    const service = new ResetPasswordService(mockRepo);
    const resetToken = TokenService.generateResetToken({ email: 'test@example.com' });

    await expect(service.execute({ resetToken, newPassword: 'newpass123' })).rejects.toThrow(Error);
  });
});
