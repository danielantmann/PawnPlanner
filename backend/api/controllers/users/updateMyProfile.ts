import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { container } from 'tsyringe';
import { UpdateUserService } from '../../../application/users/services/UpdateUserService';
import { UserMapper } from '../../../application/users/mappers/UserMapper';

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const service = container.resolve(UpdateUserService);

    const data: any = {};
    if (req.body.firstName !== undefined) data.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) data.lastName = req.body.lastName;
    if (req.body.secondLastName !== undefined) data.secondLastName = req.body.secondLastName;
    if (req.body.email !== undefined) data.email = req.body.email;

    const updatedUser = await service.execute(req.user!.id, data);

    res.status(200).json(UserMapper.toDTO(updatedUser)); // ← aquí se filtra y se devuelve DTO
  } catch (err) {
    next(err);
  }
};
