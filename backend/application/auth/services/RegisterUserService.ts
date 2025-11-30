import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserMapper } from '../../users/mappers/UserMapper';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { TokenService } from '../../../shared/utils/TokenService';
import { LoginResponseDTO } from '../dto/LoginResponseDTO';
import { User } from '../../../core/users/domain/User';

@injectable()
export class RegisterUserService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<LoginResponseDTO> {
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

    return {
      accessToken,
      refreshToken,
      user: UserMapper.toDTO(user),
    };
  }
}
