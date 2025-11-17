import {
  IsString,
  IsDateString,
  IsOptional,
  IsInt,
  Length,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

class OwnerDataDTO {
  @IsString({ message: 'Owner name must be a string' })
  @Length(2, 50, { message: 'Owner name must be between 2 and 50 characters' })
  name!: string;

  @IsEmail({}, { message: 'Owner email must be valid' })
  email!: string;

  @IsString({ message: 'Owner phone must be a string' })
  @Length(5, 20, { message: 'Owner phone must be between 5 and 20 characters' })
  phone!: string;
}

class BreedDataDTO {
  @IsString({ message: 'Breed name must be a string' })
  @Length(2, 50, { message: 'Breed name must be between 2 and 50 characters' })
  name!: string;

  @IsInt({ message: 'AnimalId must be an integer' })
  animalId!: number;
}

export class CreatePetDTO {
  @IsString({ message: 'Name must be a string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name!: string;

  @IsDateString({}, { message: 'BirthDate must be a valid date string (YYYY-MM-DD)' })
  birthDate!: string;

  // Opción 1: usar IDs existentes
  @IsOptional()
  @IsInt({ message: 'OwnerId must be an integer' })
  ownerId?: number;

  @IsOptional()
  @IsInt({ message: 'BreedId must be an integer' })
  breedId?: number;

  // Opción 2: crear Owner/Breed "on the fly"
  @IsOptional()
  @ValidateNested()
  @Type(() => OwnerDataDTO)
  ownerData?: OwnerDataDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => BreedDataDTO)
  breedData?: BreedDataDTO;

  @IsOptional()
  @IsString({ message: 'Important notes must be a string' })
  @Length(0, 1000, { message: 'Important notes must be up to 1000 characters' })
  importantNotes?: string;

  @IsOptional()
  @IsString({ message: 'Quick notes must be a string' })
  @Length(0, 1000, { message: 'Quick notes must be up to 1000 characters' })
  quickNotes?: string;
}
