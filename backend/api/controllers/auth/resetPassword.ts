import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { ResetPasswordService } from '../../../application/auth/services/ResetPasswordService';
import { validateDTO } from '../../middlewares/validateDTO';
import { ResetPasswordDTO } from '../../../application/auth/dto/ResetPasswordDTO';

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const dto = await validateDTO(ResetPasswordDTO, req.body);

    const service = container.resolve(ResetPasswordService);
    await service.execute(dto);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};
