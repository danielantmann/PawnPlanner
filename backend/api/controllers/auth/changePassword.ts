import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { ChangePasswordService } from '../../../application/auth/services/ChangePasswordService';
import { validateDTO } from '../../middlewares/validateDTO';
import { ChangePasswordDTO } from '../../../application/auth/dto/ChangePasswordDTO';

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const dto = await validateDTO(ChangePasswordDTO, {
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });

    const service = container.resolve(ChangePasswordService);
    await service.execute({
      userId: req.user!.id,
      oldPassword: dto.oldPassword,
      newPassword: dto.newPassword,
    });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};
