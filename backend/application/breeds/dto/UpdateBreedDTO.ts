import { IsInt, IsString, Length, IsOptional } from 'class-validator';

export class UpdateBreedDTO {
  @IsInt({ message: 'Id must be an integer' })
  id!: number;

  @IsString({ message: 'Name must be a string' })
  @Length(2, 80, { message: 'Name must be between 2 and 80 characters' })
  name!: string;

  @IsOptional()
  @IsInt({ message: 'AnimalId must be an integer' })
  animalId?: number;
}
