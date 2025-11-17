import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetPetByBreedService } from '../../../application/pets/services/GetPetByBreedService';

export async function getPetsByBreed(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetPetByBreedService);
    const pets = await service.execute(Number(req.params.breedId));
    res.status(200).json(pets);
  } catch (error) {
    next(error);
  }
}
