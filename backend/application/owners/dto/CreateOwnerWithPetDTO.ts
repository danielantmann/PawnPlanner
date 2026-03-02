import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsDateString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOwnerWithPetOwnerDTO {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(5, 20)
  phone!: string;
}

export class CreateOwnerWithPetPetDTO {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsInt()
  @Type(() => Number)
  breedId!: number;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  importantNotes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  quickNotes?: string;
}

export class CreateOwnerWithPetDTO {
  @ValidateNested()
  @Type(() => CreateOwnerWithPetOwnerDTO)
  owner!: CreateOwnerWithPetOwnerDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOwnerWithPetPetDTO)
  pet?: CreateOwnerWithPetPetDTO;
}
