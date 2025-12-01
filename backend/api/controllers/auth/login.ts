import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { LoginUserService } from '../../../application/auth/services/LoginUserService';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(LoginUserService);
    const result = await service.execute(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
