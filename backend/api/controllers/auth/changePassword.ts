import { RequestHandler } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { container } from 'tsyringe';
import { ChangePasswordService } from '../../../application/auth/services/ChangePasswordService';

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(ChangePasswordService);
    await service.execute({
      userId: (req as AuthRequest).user!.id,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};
