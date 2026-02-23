import { IsString, IsOptional, IsPhoneNumber, IsInt, Length } from 'class-validator';

export class CreateWorkerDTO {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
