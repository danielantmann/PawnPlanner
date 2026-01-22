import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class UpdateAppointmentDTO {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  finalPrice?: number;

  @IsOptional()
  @IsEnum(['completed', 'no-show', 'cancelled'])
  status?: 'completed' | 'no-show' | 'cancelled';
}
