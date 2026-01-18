import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateOwnerDTO {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Phone must be a valid number (7-15 digits, optional +)',
  })
  phone!: string;

  @IsEmail()
  email!: string;

  userId!: number; // viene del token
}
