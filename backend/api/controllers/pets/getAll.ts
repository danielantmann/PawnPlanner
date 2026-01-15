import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAllPetsService } from '../../../application/pets/services/GetAllPetsService';

export async function getAllPets(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const service = container.resolve(GetAllPetsService);
    const pets = await service.execute(userId);
    res.status(200).json(pets);
  } catch (error) {
    next(error);
  }
}
