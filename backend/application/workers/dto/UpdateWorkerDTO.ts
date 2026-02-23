import { IsString, IsOptional, IsBoolean, Length, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWorkerDTO {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  maxSimultaneous?: number;
}
