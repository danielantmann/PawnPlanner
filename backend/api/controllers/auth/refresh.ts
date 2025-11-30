import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenService } from '../../../application/auth/services/RefreshTokenService';

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve<RefreshTokenService>(RefreshTokenService);
    const result = await service.execute(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
