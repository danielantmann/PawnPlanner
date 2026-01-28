import { IsString, Length } from 'class-validator';

export class UpdateAnimalDTO {
  @IsString({ message: 'Species must be a string' })
  @Length(2, 50, { message: 'Species must be between 2 and 50 characters' })
  species!: string;
}
