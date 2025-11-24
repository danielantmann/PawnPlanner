import * as jwt from 'jsonwebtoken';

export class TokenService {
  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: '15m',
    });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refreshSecret', {
      expiresIn: '7d',
    });
  }

  static verify(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }
}
