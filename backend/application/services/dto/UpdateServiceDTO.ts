import { IsOptional, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateServiceDTO {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
