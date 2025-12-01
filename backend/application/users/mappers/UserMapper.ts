import { User } from '../../../core/users/domain/User';
import { UserResponseDTO } from '../dto/UserResponseDTO';
import { capitalize } from '../../../shared/utils/stringUtils';

export class UserMapper {
  static toDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      firstName: capitalize(user.firstName),
      lastName: capitalize(user.lastName),
      secondLastName: user.secondLastName ? capitalize(user.secondLastName) : undefined,
      email: user.email,
    };
  }
}
