import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAllOwnersService } from '../../../application/owners/services/GetAllOwnersService';

export async function getAllOwners(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const service = container.resolve(GetAllOwnersService);
    const results = await service.execute(userId);

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}
