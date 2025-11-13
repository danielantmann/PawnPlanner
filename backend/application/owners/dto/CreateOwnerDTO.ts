import { IsString, Length } from 'class-validator';

export class CreateOwnerDTO {
  @IsString({ message: 'Name must be a string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name!: string;

  @IsString({ message: 'Phone must be a string' })
  @Length(2, 50, { message: 'Phone must be between 2 and 50 characters' })
  phone!: string;

  @IsString({ message: 'Email must be a string' })
  @Length(2, 50, { message: 'Email must be between 2 and 50 characters' })
  email!: string;
}
