import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetPetByNameService } from '../../../application/pets/services/GetPetByNameService';

export async function getPetsByName(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const service = container.resolve(GetPetByNameService);
    const pets = await service.execute(req.params.name, userId);
    res.status(200).json(pets);
  } catch (error) {
    next(error);
  }
}
