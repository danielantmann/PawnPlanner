import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetBreedByIdService } from '../../../application/breeds/services/GetBreedByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export async function getBreedById(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetBreedByIdService);
    const breed = await service.execute(Number(req.params.id));
    res.status(200).json(breed);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
}
