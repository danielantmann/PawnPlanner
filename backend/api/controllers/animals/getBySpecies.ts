import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAnimalBySpeciesService } from '../../../application/animals/services/GetAnimalBySpeciesService';

export async function getAnimalBySpecies(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetAnimalBySpeciesService);
    const animals = await service.execute(req.params.species);
    res.status(200).json(animals);
  } catch (error) {
    next(error);
  }
}
