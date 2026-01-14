import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetOwnerByNameService } from '../../../application/owners/services/GetOwnerByNameService';

export async function getOwnerByName(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const service = container.resolve(GetOwnerByNameService);
    const result = await service.execute(req.params.name, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
