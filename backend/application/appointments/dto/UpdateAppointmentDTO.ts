import { IsOptional, IsString, IsNumber, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAppointmentDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  petId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  serviceId?: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  finalPrice?: number;

  @IsOptional()
  @IsEnum(['completed', 'no-show', 'cancelled'])
  status?: 'completed' | 'no-show' | 'cancelled';
}
