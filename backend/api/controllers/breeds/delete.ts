import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DeleteBreedService } from '../../../application/breeds/services/DeleteBreedService';

export async function deleteBreed(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const service = container.resolve(DeleteBreedService);
    await service.execute(Number(req.params.id), userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
