import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAllAnimalsService } from '../../../application/animals/services/GetAllAnimalsService';

export async function getAllAnimals(_req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetAllAnimalsService);
    const animals = await service.execute();
    res.status(200).json(animals);
  } catch (error) {
    next(error);
  }
}
