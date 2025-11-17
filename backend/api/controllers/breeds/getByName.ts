import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetBreedByNameService } from '../../../application/breeds/services/GetBreedByNameService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export async function getBreedByName(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetBreedByNameService);
    const breeds = await service.execute(req.params.name);
    res.status(200).json(breeds);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
}
