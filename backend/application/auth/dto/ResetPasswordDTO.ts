import { IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  resetToken!: string;

  @IsString()
  @Length(6, 12, { message: 'Password must be between 6 and 12 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  newPassword!: string;
}
