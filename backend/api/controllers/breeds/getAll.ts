import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAllBreedsService } from '../../../application/breeds/services/GetAllBreedsService';

export async function getAllBreeds(_req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetAllBreedsService);
    const breeds = await service.execute();
    res.status(200).json(breeds);
  } catch (error) {
    next(error);
  }
}
