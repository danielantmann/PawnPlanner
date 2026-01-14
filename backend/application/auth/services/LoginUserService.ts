import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { LoginUserDTO } from '../dto/LoginUserDTO';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { TokenService } from '../../../shared/utils/TokenService';
import { User } from '../../../core/users/domain/User';

@injectable()
export class LoginUserService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(
    dto: LoginUserDTO
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase().trim());
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const valid = await PasswordService.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const accessToken = TokenService.generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = TokenService.generateRefreshToken({ id: user.id, email: user.email });

    return { user, accessToken, refreshToken };
  }
}
