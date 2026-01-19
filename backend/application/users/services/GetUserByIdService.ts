import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../core/users/domain/IUserRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { UserMapper } from '../mappers/UserMapper';
import { UserResponseDTO } from '../dto/UserResponseDTO';

@injectable()
export class GetUserByIdService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }

    return UserMapper.toDTO(user);
  }
}
