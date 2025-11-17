import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetBreedsByAnimalService } from '../../../application/breeds/services/GetBreedsByAnimalService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export async function getBreedsByAnimal(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetBreedsByAnimalService);
    const breeds = await service.execute(Number(req.params.animalId));
    res.status(200).json(breeds);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
}
