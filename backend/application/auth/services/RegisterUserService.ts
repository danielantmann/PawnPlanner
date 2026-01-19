import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { TokenService } from '../../../shared/utils/TokenService';
import { User } from '../../../core/users/domain/User';
import { ConflictError } from '../../../shared/errors/ConflictError';

@injectable()
export class RegisterUserService {
  constructor(@inject('IUserRepository') private readonly userRepo: IUserRepository) {}

  async execute(dto: CreateUserDTO) {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new ConflictError('Email already exists');

    const passwordHash = await PasswordService.hash(dto.password);

    const user = new User(
      null,
      dto.firstName.toLowerCase().trim(),
      dto.lastName.toLowerCase().trim(),
      dto.secondLastName?.toLowerCase().trim() ?? null,
      email,
      passwordHash
    );

    const saved = await this.userRepo.save(user);

    const accessToken = TokenService.generateAccessToken({
      id: saved.id!,
      email: saved.email,
    });

    const refreshToken = TokenService.generateRefreshToken({
      id: saved.id!,
      email: saved.email,
    });

    return { user: saved, accessToken, refreshToken };
  }
}
