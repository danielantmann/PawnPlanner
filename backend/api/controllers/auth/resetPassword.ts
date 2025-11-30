import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ResetPasswordService } from '../../../application/auth/services/ResetPasswordService';

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve<ResetPasswordService>(ResetPasswordService);
    await service.execute(req.body);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}
