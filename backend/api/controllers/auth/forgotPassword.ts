import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { ForgotPasswordService } from '../../../application/auth/services/ForgotPasswordService';
import { validateDTO } from '../../middlewares/validateDTO';
import { ForgotPasswordDTO } from '../../../application/auth/dto/ForgotPasswordDTO';

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const dto = await validateDTO(ForgotPasswordDTO, req.body);

    const service = container.resolve(ForgotPasswordService);
    const result = await service.execute(dto);

    res.json(result); // en local devuelve { resetToken }
  } catch (err) {
    next(err);
  }
};
