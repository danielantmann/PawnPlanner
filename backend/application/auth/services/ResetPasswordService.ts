// application/auth/services/ResetPasswordService.ts
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { ResetPasswordDTO } from '../dto/ResetPasswordDTO';
import { TokenService } from '../../../shared/utils/TokenService';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { PasswordService } from '../../../shared/utils/PasswordService';

@injectable()
export class ResetPasswordService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(dto: ResetPasswordDTO): Promise<void> {
    const payload = TokenService.verifyResetToken(dto.resetToken);
    if (!payload || !payload.email) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    const user = await this.userRepo.findByEmail(payload.email.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedError('Invalid reset token');
    }

    // Hasheamos la nueva contraseña
    const hash = await PasswordService.hash(dto.newPassword);
    user.passwordHash = hash;

    await this.userRepo.save(user);

    // Opcional: invalidar el reset token si lo persistes en DB
  }
}
