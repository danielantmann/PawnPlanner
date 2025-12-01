import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenService } from '../../../application/auth/services/RefreshTokenService';

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(RefreshTokenService);
    const result = await service.execute({
      refreshToken: req.body.refreshToken,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
