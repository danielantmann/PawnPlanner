import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { container } from 'tsyringe';
import { GetUserByIdService } from '../../../application/users/services/GetUserByIdService';
import { UserMapper } from '../../../application/users/mappers/UserMapper';

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const service = container.resolve(GetUserByIdService);
    const user = await service.execute(req.user!.id);
    res.json(UserMapper.toDTO(user));
  } catch (err) {
    next(err);
  }
};
