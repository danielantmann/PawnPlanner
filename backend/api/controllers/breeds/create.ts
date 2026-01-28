import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateBreedService } from '../../../application/breeds/services/CreateBreedService';

export async function createBreed(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const service = container.resolve(CreateBreedService);
    const breed = await service.execute(req.body, userId);
    res.status(201).json(breed);
  } catch (error) {
    next(error);
  }
}
