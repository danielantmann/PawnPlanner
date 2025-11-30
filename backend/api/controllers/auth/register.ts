import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { RegisterUserService } from '../../../application/auth/services/RegisterUserService';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve<RegisterUserService>(RegisterUserService);
    const result = await service.execute(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
