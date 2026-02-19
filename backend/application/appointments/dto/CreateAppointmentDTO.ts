import { IsInt, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDTO {
  @Type(() => Number)
  @IsInt()
  petId!: number;

  @Type(() => Number)
  @IsInt()
  serviceId!: number;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  workerId?: number;

  @IsOptional()
  @IsNumber()
  finalPrice?: number;
}
