import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAnimalsBySpeciesService } from '../../../application/animals/services/GetAnimalsBySpeciesService';

export async function getAnimalsBySpecies(req: Request, res: Response, next: NextFunction) {
  try {
    const { species } = req.params;
    const userId = req.user.id;

    const service = container.resolve(GetAnimalsBySpeciesService);
    const animals = await service.execute(species, userId);

    res.status(200).json(animals);
  } catch (error) {
    next(error);
  }
}
