import { User } from '../../../core/users/domain/User';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { IUserRepository } from './../../../core/users/domain/IUserRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetUserByIdService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }

    return user;
  }
}
