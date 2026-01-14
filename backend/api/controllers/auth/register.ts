import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { RegisterUserService } from '../../../application/auth/services/RegisterUserService';
import { UserMapper } from '../../../application/users/mappers/UserMapper';
import { validateDTO } from '../../middlewares/validateDTO';
import { CreateUserDTO } from '../../../application/auth/dto/CreateUserDTO';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const dto = await validateDTO(CreateUserDTO, req.body);
    const service = container.resolve(RegisterUserService);
    const { user, accessToken, refreshToken } = await service.execute(dto);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: UserMapper.toDTO(user),
    });
  } catch (err) {
    next(err);
  }
};
