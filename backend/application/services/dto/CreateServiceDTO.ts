import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateServiceDTO {
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}
