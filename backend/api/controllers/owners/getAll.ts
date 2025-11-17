import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAllOwnersService } from '../../../application/owners/services/GetAllOwnersService';

export async function getAllOwners(_req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetAllOwnersService);
    const results = await service.execute();
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}
