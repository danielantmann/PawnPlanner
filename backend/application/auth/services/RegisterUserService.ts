import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { TokenService } from '../../../shared/utils/TokenService';
import { User } from '../../../core/users/domain/User';
import { ConflictError } from '../../../shared/errors/ConflictError';

@injectable()
export class RegisterUserService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(
    dto: CreateUserDTO
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const existing = await this.userRepo.findByEmail(dto.email.toLowerCase().trim());
    if (existing) {
      throw new ConflictError('Email already exists');
    }

    const passwordHash = await PasswordService.hash(dto.password);

    const user = new User();
    user.firstName = dto.firstName.toLowerCase().trim();
    user.lastName = dto.lastName.toLowerCase().trim();
    user.secondLastName = dto.secondLastName?.toLowerCase().trim();
    user.email = dto.email.toLowerCase().trim();
    user.passwordHash = passwordHash;

    await this.userRepo.save(user);

    const accessToken = TokenService.generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = TokenService.generateRefreshToken({ id: user.id, email: user.email });

    return { user, accessToken, refreshToken };
  }
}
