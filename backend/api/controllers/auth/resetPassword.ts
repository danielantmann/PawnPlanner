import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { ResetPasswordService } from '../../../application/auth/services/ResetPasswordService';

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(ResetPasswordService);
    await service.execute(req.body);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};
