import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UpdateBreedService } from '../../../application/breeds/services/UpdateBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export async function updateBreed(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(UpdateBreedService);
    const id = Number(req.params.id);
    const breed = await service.execute(id, req.body);
    res.status(200).json(breed);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
}
