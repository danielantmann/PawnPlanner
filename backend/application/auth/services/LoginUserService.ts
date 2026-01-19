import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { LoginUserDTO } from '../dto/LoginUserDTO';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { TokenService } from '../../../shared/utils/TokenService';

@injectable()
export class LoginUserService {
  constructor(@inject('IUserRepository') private readonly userRepo: IUserRepository) {}

  async execute(dto: LoginUserDTO) {
    const email = dto.email.toLowerCase().trim();

    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const valid = await PasswordService.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const accessToken = TokenService.generateAccessToken({
      id: user.id!,
      email: user.email,
    });

    const refreshToken = TokenService.generateRefreshToken({
      id: user.id!,
      email: user.email,
    });

    return { user, accessToken, refreshToken };
  }
}
