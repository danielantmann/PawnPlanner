import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { LoginUserService } from '../../../application/auth/services/LoginUserService';
import { UserMapper } from '../../../application/users/mappers/UserMapper';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(LoginUserService);
    const { user, accessToken, refreshToken } = await service.execute(req.body);

    res.json({
      accessToken,
      refreshToken,
      user: UserMapper.toDTO(user),
    });
  } catch (err) {
    next(err);
  }
};
