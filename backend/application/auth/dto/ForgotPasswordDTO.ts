import { IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;
}
