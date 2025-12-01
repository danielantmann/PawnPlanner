import { RequestHandler } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { container } from 'tsyringe';
import { UpdateUserService } from '../../../application/users/services/UpdateUserService';

export const updateMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const service = container.resolve(UpdateUserService);

    const data: any = {};
    if (req.body.firstName !== undefined) data.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) data.lastName = req.body.lastName;
    if (req.body.email !== undefined) data.email = req.body.email;

    await service.execute((req as AuthRequest).user!.id, data);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};
