import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { ForgotPasswordService } from '../../../application/auth/services/ForgotPasswordService';

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(ForgotPasswordService);
    const result = await service.execute(req.body);
    res.json(result); // en local devuelve { resetToken }
  } catch (err) {
    next(err);
  }
};
