import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { ForgotPasswordDTO } from '../dto/ForgotPasswordDTO';
import { TokenService } from '../../../shared/utils/TokenService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class ForgotPasswordService {
  constructor(@inject('UserRepository') private readonly userRepo: IUserRepository) {}

  async execute(dto: ForgotPasswordDTO): Promise<{ resetToken: string }> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      // En producción puedes devolver 200 silencioso para no revelar si el email existe
      throw new NotFoundError('User not found');
    }

    // Generamos un reset token corto
    const resetToken = TokenService.generateResetToken({ id: user.id, email: user.email });

    // Aquí normalmente enviarías el token por email con un MailService
    return { resetToken };
  }
}
