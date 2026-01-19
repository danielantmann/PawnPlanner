import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { ForgotPasswordDTO } from '../dto/ForgotPasswordDTO';
import { TokenService } from '../../../shared/utils/TokenService';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';

@injectable()
export class ForgotPasswordService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(dto: ForgotPasswordDTO): Promise<{ resetToken: string }> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid email');
    }

    const resetToken = TokenService.generateResetToken({
      id: user.id!,
      email: user.email,
    });

    return { resetToken };
  }
}
