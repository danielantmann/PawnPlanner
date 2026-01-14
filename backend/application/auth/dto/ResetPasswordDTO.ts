// ResetPasswordDTO.ts
import { IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  resetToken!: string;

  @IsString()
  @Length(6, 12, { message: 'Password must be between 6 and 12 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  newPassword!: string;
}
