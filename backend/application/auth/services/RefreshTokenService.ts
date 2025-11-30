// application/auth/services/RefreshTokenService.ts
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { RefreshTokenDTO } from '../dto/RefreshTokenDTO';
import { LoginResponseDTO } from '../dto/LoginResponseDTO';
import { TokenService } from '../../../shared/utils/TokenService';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { UserMapper } from '../../users/mappers/UserMapper';

@injectable()
export class RefreshTokenService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(dto: RefreshTokenDTO): Promise<LoginResponseDTO> {
    const payload = TokenService.verifyRefreshToken(dto.refreshToken);
    if (!payload || !payload.email) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await this.userRepo.findByEmail(payload.email.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const accessToken = TokenService.generateAccessToken({ id: user.id, email: user.email });
    const newRefreshToken = TokenService.generateRefreshToken({ id: user.id, email: user.email });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: UserMapper.toDTO(user),
    };
  }
}
