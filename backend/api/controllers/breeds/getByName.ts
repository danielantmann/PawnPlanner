import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetBreedByNameService } from '../../../application/breeds/services/GetBreedByNameService';

export async function getBreedByName(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const service = container.resolve(GetBreedByNameService);
    const breeds = await service.execute(req.params.name, userId);
    res.status(200).json(breeds);
  } catch (error) {
    next(error);
  }
}
