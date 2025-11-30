import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ForgotPasswordService } from '../../../application/auth/services/ForgotPasswordService';

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve<ForgotPasswordService>(ForgotPasswordService);
    const result = await service.execute(req.body);
    res.json(result); // en local devuelve { resetToken }
  } catch (err) {
    next(err);
  }
}
