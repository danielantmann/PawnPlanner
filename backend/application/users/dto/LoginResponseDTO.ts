import { UserResponseDTO } from './UserResponseDTO';

export class LoginResponseDTO {
  accessToken!: string;
  refreshToken!: string;
  user!: UserResponseDTO;
}
