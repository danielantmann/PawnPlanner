import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UpdateBreedService } from '../../../application/breeds/services/UpdateBreedService';

export async function updateBreed(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const service = container.resolve(UpdateBreedService);
    const id = Number(req.params.id);
    const breed = await service.execute(id, req.body, userId);
    res.status(200).json(breed);
  } catch (error) {
    next(error);
  }
}
