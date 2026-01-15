import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetBreedByIdService } from '../../../application/breeds/services/GetBreedByIdService';

export async function getBreedById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const service = container.resolve(GetBreedByIdService);
    const breed = await service.execute(Number(req.params.id), userId);
    res.status(200).json(breed);
  } catch (error) {
    next(error);
  }
}
