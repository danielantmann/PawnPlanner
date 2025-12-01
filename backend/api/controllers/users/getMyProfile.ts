import { RequestHandler } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { container } from 'tsyringe';
import { GetUserByIdService } from '../../../application/users/services/GetUserByIdService';

export const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(GetUserByIdService);
    const user = await service.execute((req as AuthRequest).user!.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
