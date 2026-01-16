import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { container } from 'tsyringe';
import { UpdateUserService } from '../../../application/users/services/UpdateUserService';
import { UpdateUserDTO } from '../../../application/users/dto/UpdateUserDTO';
import { UserMapper } from '../../../application/users/mappers/UserMapper';

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // El validationMiddleware ya validó el DTO antes de llegar aquí
    const dto = req.body as UpdateUserDTO;

    const service = container.resolve(UpdateUserService);
    const updatedUser = await service.execute(req.user!.id, dto);

    return res.status(200).json(UserMapper.toDTO(updatedUser));
  } catch (err) {
    next(err);
  }
};
