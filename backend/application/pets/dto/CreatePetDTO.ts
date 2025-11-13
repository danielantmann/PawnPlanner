import { IsString, IsDateString, IsOptional, IsInt, Length } from 'class-validator';

export class CreatePetDTO {
  @IsString({ message: 'Name must be a string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name!: string;

  @IsDateString({}, { message: 'BirthDate must be a valid date string (YYYY-MM-DD)' })
  birthDate!: string;

  @IsInt({ message: 'OwnerId must be an integer' })
  ownerId!: number;

  @IsInt({ message: 'BreedId must be an integer' })
  breedId!: number;

  @IsOptional()
  @IsString({ message: 'Important notes must be a string' })
  @Length(0, 1000, { message: 'Important notes must be up to 1000 characters' })
  importantNotes?: string;

  @IsOptional()
  @IsString({ message: 'Quick notes must be a string' })
  @Length(0, 1000, { message: 'Quick notes must be up to 1000 characters' })
  quickNotes?: string;
}
