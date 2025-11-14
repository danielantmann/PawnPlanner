import { IsInt, IsOptional, IsString, IsDateString, Length } from 'class-validator';

export class UpdatePetDTO {
  @IsInt({ message: 'Id must be an integer' })
  id!: number;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name?: string;

  @IsOptional()
  @IsDateString({}, { message: 'BirthDate must be a valid date string (YYYY-MM-DD)' })
  birthDate?: string;

  @IsOptional()
  @IsString({ message: 'Important notes must be a string' })
  @Length(0, 255, { message: 'Important notes must be up to 255 characters' })
  importantNotes?: string;

  @IsOptional()
  @IsString({ message: 'Quick notes must be a string' })
  @Length(0, 255, { message: 'Quick notes must be up to 255 characters' })
  quickNotes?: string;
}
