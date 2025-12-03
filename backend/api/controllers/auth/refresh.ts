import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenService } from '../../../application/auth/services/RefreshTokenService';
import { UserMapper } from '../../../application/users/mappers/UserMapper';

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(RefreshTokenService);
    const { user, accessToken, refreshToken } = await service.execute({
      refreshToken: req.body.refreshToken,
    });

    res.json({
      accessToken,
      refreshToken,
      user: UserMapper.toDTO(user),
    });
  } catch (err) {
    next(err);
  }
};
