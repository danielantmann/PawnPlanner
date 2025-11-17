import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAnimalByIdService } from '../../../application/animals/services/GetAnimalByIdService';

export async function getAnimalById(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetAnimalByIdService);
    const animal = await service.execute(Number(req.params.id));
    res.status(200).json(animal);
  } catch (error) {
    next(error);
  }
}
