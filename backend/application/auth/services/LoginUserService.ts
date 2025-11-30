import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { LoginUserDTO } from '../dto/LoginUserDTO';
import { LoginResponseDTO } from '../dto/LoginResponseDTO';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { TokenService } from '../../../shared/utils/TokenService';
import { UserMapper } from '../../users/mappers/UserMapper';

@injectable()
export class LoginUserService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(dto: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase().trim());

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const valid = await PasswordService.compare(dto.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = TokenService.generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = TokenService.generateRefreshToken({ id: user.id, email: user.email });

    return {
      accessToken,
      refreshToken,
      user: UserMapper.toDTO(user),
    };
  }
}
