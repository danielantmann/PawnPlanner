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
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(5, 20)
  phone!: string;
}

class BreedDataDTO {
  @IsString()
  @Length(2, 50)
  name!: string;

  @Type(() => Number)
  @IsInt()
  animalId!: number;
}

export class CreatePetDTO {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ownerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  breedId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => OwnerDataDTO)
  ownerData?: OwnerDataDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => BreedDataDTO)
  breedData?: BreedDataDTO;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  importantNotes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  quickNotes?: string;
}
