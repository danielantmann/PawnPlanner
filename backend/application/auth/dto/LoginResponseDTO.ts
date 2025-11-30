import { UserResponseDTO } from '../../users/dto/UserResponseDTO';

export class LoginResponseDTO {
  accessToken!: string;
  refreshToken!: string;
  user!: UserResponseDTO;
}
