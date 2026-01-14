import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { LoginUserService } from '../../../application/auth/services/LoginUserService';
import { UserMapper } from '../../../application/users/mappers/UserMapper';
import { validateDTO } from '../../middlewares/validateDTO';
import { LoginUserDTO } from '../../../application/auth/dto/LoginUserDTO';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const dto = await validateDTO(LoginUserDTO, req.body);

    const service = container.resolve(LoginUserService);
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
