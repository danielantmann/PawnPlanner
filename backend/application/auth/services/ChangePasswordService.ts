import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { PasswordService } from '../../../shared/utils/PasswordService';
import { ChangePasswordInput } from '../types/ChangePasswordInput';

@injectable()
export class ChangePasswordService {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

  async execute({ userId, oldPassword, newPassword }: ChangePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const isValid = await PasswordService.compare(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Old password is incorrect');
    }

    user.passwordHash = await PasswordService.hash(newPassword);
    await this.userRepository.save(user);
  }
}
