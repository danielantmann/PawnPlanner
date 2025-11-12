import { IsString, IsDateString, IsOptional, IsInt } from 'class-validator';

export class CreatePetDTO {
  @IsString()
  name!: string;

  @IsDateString()
  birthDate!: string; // mejor como string ISO, luego lo parseas a Date

  @IsInt()
  ownerId!: number;

  @IsInt()
  breedId!: number;

  @IsOptional()
  @IsString()
  importantNotes?: string;

  @IsOptional()
  @IsString()
  quickNotes?: string;
}
