import * as jwt from 'jsonwebtoken';

export class TokenService {
  private static ACCESS_SECRET = process.env.JWT_SECRET || 'access-secret';
  private static REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  private static RESET_SECRET = process.env.JWT_RESET_SECRET || 'reset-secret';

  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: '7d' });
  }

  static generateResetToken(payload: object): string {
    return jwt.sign(payload, this.RESET_SECRET, { expiresIn: '15m' });
  }

  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.ACCESS_SECRET);
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.REFRESH_SECRET);
    } catch {
      return null;
    }
  }

  static verifyResetToken(token: string): any {
    try {
      return jwt.verify(token, this.RESET_SECRET);
    } catch {
      return null;
    }
  }
}
