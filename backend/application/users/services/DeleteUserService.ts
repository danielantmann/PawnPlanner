import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class DeleteUserService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<void> {
    const deleted = await this.userRepository.delete(userId);

    if (!deleted) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
  }
}
