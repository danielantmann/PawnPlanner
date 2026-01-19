import { container } from 'tsyringe';
import { RegisterUserService } from '../application/auth/services/RegisterUserService';
import { LoginUserService } from '../application/auth/services/LoginUserService';
import { RefreshTokenService } from '../application/auth/services/RefreshTokenService';
import { ForgotPasswordService } from '../application/auth/services/ForgotPasswordService';
import { ResetPasswordService } from '../application/auth/services/ResetPasswordService';
import { ChangePasswordService } from '../application/auth/services/ChangePasswordService';

export function setupAuthContainer(): void {
  container.register(RegisterUserService, { useClass: RegisterUserService });
  container.register(LoginUserService, { useClass: LoginUserService });
  container.register(RefreshTokenService, { useClass: RefreshTokenService });
  container.register(ForgotPasswordService, { useClass: ForgotPasswordService });
  container.register(ResetPasswordService, { useClass: ResetPasswordService });
  container.register(ChangePasswordService, { useClass: ChangePasswordService });
}
