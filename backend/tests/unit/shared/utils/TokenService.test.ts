import { describe, it, expect } from 'vitest';
import { TokenService } from '../../../../shared/utils/TokenService';

describe('TokenService', () => {
  it('should generate and verify an access token', () => {
    const token = TokenService.generateAccessToken({ id: 1 });

    const decoded = TokenService.verifyAccessToken(token);

    expect(decoded).toHaveProperty('id', 1);
  });

  it('should return null for invalid access token', () => {
    const decoded = TokenService.verifyAccessToken('invalid.token');
    expect(decoded).toBeNull();
  });

  it('should generate and verify a refresh token', () => {
    const token = TokenService.generateRefreshToken({ id: 1 });

    const decoded = TokenService.verifyRefreshToken(token);

    expect(decoded).toHaveProperty('id', 1);
  });

  it('should return null for invalid refresh token', () => {
    const decoded = TokenService.verifyRefreshToken('invalid.token');
    expect(decoded).toBeNull();
  });

  it('should generate and verify a reset token', () => {
    const token = TokenService.generateResetToken({ id: 1 });

    const decoded = TokenService.verifyResetToken(token);

    expect(decoded).toHaveProperty('id', 1);
  });

  it('should return null for invalid reset token', () => {
    const decoded = TokenService.verifyResetToken('invalid.token');
    expect(decoded).toBeNull();
  });
});
