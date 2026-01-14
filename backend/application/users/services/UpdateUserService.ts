import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { User } from '../../../core/users/domain/User';

@injectable()
export class UpdateUserService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  async execute(userId: number, data: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }

    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new ConflictError(`Email ${data.email} is already in use`);
      }
    }

    const updated = await this.userRepository.update(userId, data);
    if (!updated) {
      throw new NotFoundError(`Update failed for user ${userId}`);
    }

    return updated;
  }
}
