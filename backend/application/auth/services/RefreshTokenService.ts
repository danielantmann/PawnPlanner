import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { RefreshTokenDTO } from '../dto/RefreshTokenDTO';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { TokenService } from '../../../shared/utils/TokenService';
import { User } from '../../../core/users/domain/User';

@injectable()
export class RefreshTokenService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(
    dto: RefreshTokenDTO
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const payload = TokenService.verifyRefreshToken(dto.refreshToken);
    if (!payload || !payload.email) throw new UnauthorizedError('Invalid refresh token');

    const user = await this.userRepo.findByEmail(payload.email.toLowerCase().trim());
    if (!user) throw new UnauthorizedError('Invalid refresh token');

    const accessToken = TokenService.generateAccessToken({ id: user.id, email: user.email });
    const newRefreshToken = TokenService.generateRefreshToken({ id: user.id, email: user.email });

    return { user, accessToken, refreshToken: newRefreshToken };
  }
}
