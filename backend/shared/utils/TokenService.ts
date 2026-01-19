import * as jwt from 'jsonwebtoken';

export class TokenService {
  private static getAccessSecret(): string {
    return process.env.JWT_SECRET || 'access-secret';
  }

  private static getRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  }

  private static getResetSecret(): string {
    return process.env.JWT_RESET_SECRET || 'reset-secret';
  }

  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.getAccessSecret(), { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.getRefreshSecret(), { expiresIn: '7d' });
  }

  static generateResetToken(payload: object): string {
    return jwt.sign(payload, this.getResetSecret(), { expiresIn: '15m' });
  }

  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.getAccessSecret());
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.getRefreshSecret());
    } catch {
      return null;
    }
  }

  static verifyResetToken(token: string): any {
    try {
      return jwt.verify(token, this.getResetSecret());
    } catch {
      return null;
    }
  }
}
