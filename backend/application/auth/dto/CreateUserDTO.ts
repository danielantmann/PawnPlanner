import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsString({ message: 'First name must be a string' })
  @Length(2, 100, { message: 'First name must be between 2 and 100 characters' })
  firstName!: string;

  @IsString({ message: 'Last name must be a string' })
  @Length(2, 100, { message: 'Last name must be between 2 and 100 characters' })
  lastName!: string;

  @IsOptional()
  @IsString({ message: 'Second last name must be a string' })
  @Length(2, 100, { message: 'Second last name must be between 2 and 100 characters' })
  secondLastName?: string;

  @IsEmail({}, { message: 'Email must be a valid address' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @Length(6, 12, { message: 'Password must be between 6 and 12 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password!: string;
}
