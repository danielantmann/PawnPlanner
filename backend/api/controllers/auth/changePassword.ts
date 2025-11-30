import { Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ChangePasswordService } from '../../../application/auth/services/ChangePasswordService';
import { AuthRequest } from '../../middlewares/authMiddleware'; // ahora sí, ruta correcta

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const service = container.resolve<ChangePasswordService>(ChangePasswordService);
    await service.execute({
      userId: req.user!.id, // viene del JWT
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
}
