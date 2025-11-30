import { IsString } from 'class-validator';

export class RefreshTokenDTO {
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken!: string;
}
