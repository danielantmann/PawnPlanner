import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateBreedDTO {
  @IsString()
  @Length(2, 80)
  name!: string;

  @IsInt()
  @IsPositive()
  animalId!: number;
}
