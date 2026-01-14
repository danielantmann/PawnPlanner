import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateOwnerDTO {
  @IsString({ message: 'Name must be a string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name!: string;

  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Phone must be a valid number (7-15 digits, optional +)',
  })
  phone!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  // No se valida porque viene del token, no del cliente
  userId!: number;
}
