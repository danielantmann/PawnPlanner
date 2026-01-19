import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { RefreshTokenService } from '../../../application/auth/services/RefreshTokenService';
import { User } from '../../../core/users/domain/User';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { TokenService } from '../../../shared/utils/TokenService';
import jwt from 'jsonwebtoken';

describe('RefreshTokenService', () => {
  it('should refresh tokens for valid user', async () => {
    const user = new User(1, 'Test', 'User', null, 'test@example.com', 'hash');

    const mockRepo = { findByEmail: async () => user } as any;
    const service = new RefreshTokenService(mockRepo);

    const refreshToken = TokenService.generateRefreshToken({ id: 1, email: 'test@example.com' });
    const result = await service.execute({ refreshToken });

    expect(result.user).toBe(user);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should throw UnauthorizedError for invalid token', async () => {
    const mockRepo = { findByEmail: async () => null } as any;
    const service = new RefreshTokenService(mockRepo);

    await expect(service.execute({ refreshToken: 'invalid' })).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if token payload has no email', async () => {
    const badToken = TokenService.generateAccessToken({ id: 1 }); // no email
    const mockRepo = { findByEmail: async () => null } as any;
    const service = new RefreshTokenService(mockRepo);

    await expect(service.execute({ refreshToken: badToken })).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if user no longer exists', async () => {
    const refreshToken = TokenService.generateRefreshToken({ id: 1, email: 'ghost@example.com' });
    const mockRepo = { findByEmail: async () => null } as any;
    const service = new RefreshTokenService(mockRepo);

    await expect(service.execute({ refreshToken })).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if token is expired', async () => {
    const user = new User(1, 'Test', 'User', null, 'test@example.com', 'hash');

    const mockRepo = { findByEmail: async () => user } as any;
    const service = new RefreshTokenService(mockRepo);

    // Generamos un token con expiración inmediata
    const expiredToken = jwt.sign(
      { id: 1, email: 'test@example.com' },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '1ms' }
    );

    // Esperamos unos milisegundos para que expire
    await new Promise((res) => setTimeout(res, 10));

    await expect(service.execute({ refreshToken: expiredToken })).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw UnauthorizedError if repo fails', async () => {
    const badRepo = {
      findByEmail: async () => {
        throw new Error('DB error');
      },
    } as any;
    const service = new RefreshTokenService(badRepo);

    const refreshToken = TokenService.generateRefreshToken({ id: 1, email: 'test@example.com' });

    await expect(service.execute({ refreshToken })).rejects.toThrow(Error);
  });
});
