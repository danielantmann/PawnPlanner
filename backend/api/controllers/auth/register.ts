import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { RegisterUserService } from '../../../application/auth/services/RegisterUserService';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(RegisterUserService);
    const result = await service.execute(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
