import { IsInt, IsString, Length } from 'class-validator';

export class UpdateBreedDTO {
  @IsInt()
  id!: number;

  @IsString()
  @Length(2, 80)
  name!: string;

  @IsInt()
  animalId?: number;
}
