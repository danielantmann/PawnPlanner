import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenService } from '../../../application/auth/services/RefreshTokenService';
import { UserMapper } from '../../../application/users/mappers/UserMapper';
import { validateDTO } from '../../middlewares/validateDTO';
import { RefreshTokenDTO } from '../../../application/auth/dto/RefreshTokenDTO';

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const dto = await validateDTO(RefreshTokenDTO, req.body);

    const service = container.resolve(RefreshTokenService);
    const { user, accessToken, refreshToken } = await service.execute(dto);

    res.json({
      accessToken,
      refreshToken,
      user: UserMapper.toDTO(user),
    });
  } catch (err) {
    next(err);
  }
};
