import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdatePetDTO {
  @IsInt()
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  importantNotes?: string;

  @IsOptional()
  @IsString()
  quickNotes?: string;
}
