import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateBreedDTO {
  @IsString({ message: 'Name must be a string' })
  @Length(2, 80, { message: 'Name must be between 2 and 80 characters' })
  name!: string;

  @IsInt({ message: 'AnimalId must be an integer' })
  @IsPositive({ message: 'AnimalId must be a positive number' })
  animalId!: number;
}
