import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { RegisterUserService } from '../../../application/auth/services/RegisterUserService';
import { UserMapper } from '../../../application/users/mappers/UserMapper';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(RegisterUserService);
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
