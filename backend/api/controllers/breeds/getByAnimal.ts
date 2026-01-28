import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetBreedsByAnimalService } from '../../../application/breeds/services/GetBreedsByAnimalService';

export async function getBreedsByAnimal(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const service = container.resolve(GetBreedsByAnimalService);
    const breeds = await service.execute(Number(req.params.animalId), userId);
    res.status(200).json(breeds);
  } catch (error) {
    next(error);
  }
}
