import { describe, it, expect } from 'vitest';
import { ForgotPasswordService } from '../../../application/auth/services/ForgotPasswordService';
import { User } from '../../../core/users/domain/User';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { TokenService } from '../../../shared/utils/TokenService';

describe('ForgotPasswordService', () => {
  it('should generate reset token for valid user', async () => {
    const user = new User();
    user.email = 'test@example.com';

    const mockRepo = { findByEmail: async () => user } as any;
    const service = new ForgotPasswordService(mockRepo);

    const result = await service.execute({ email: 'test@example.com' });

    expect(result.resetToken).toBeDefined();
    const decoded = TokenService.verifyResetToken(result.resetToken);
    expect(decoded.email).toBe('test@example.com');
  });

  it('should throw UnauthorizedError if user not found', async () => {
    const mockRepo = { findByEmail: async () => null } as any;
    const service = new ForgotPasswordService(mockRepo);

    await expect(service.execute({ email: 'ghost@example.com' })).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw error if repo fails', async () => {
    const mockRepo = {
      findByEmail: async () => {
        throw new Error('DB error');
      },
    } as any;
    const service = new ForgotPasswordService(mockRepo);

    await expect(service.execute({ email: 'test@example.com' })).rejects.toThrow(Error);
  });
});
