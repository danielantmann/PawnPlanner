import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { LoginUserService } from '../../../application/auth/services/LoginUserService';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve<LoginUserService>(LoginUserService);
    const result = await service.execute(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
