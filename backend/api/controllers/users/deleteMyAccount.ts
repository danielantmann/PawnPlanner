import { RequestHandler } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { container } from 'tsyringe';
import { DeleteUserService } from '../../../application/users/services/DeleteUserService';

export const deleteMyAccount: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(DeleteUserService);
    await service.execute((req as AuthRequest).user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
