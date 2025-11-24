import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginUserDTO {
  @IsEmail({}, { message: 'Email must be a valid address' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password!: string;
}
