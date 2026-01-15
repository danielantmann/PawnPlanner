import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateAnimalService } from '../../../application/animals/services/CreateAnimalService';
import { CreateAnimalDTO } from '../../../application/animals/dto/CreateAnimalDTO';

export async function createAnimal(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const service = container.resolve(CreateAnimalService);
    const animal = await service.execute(req.body as CreateAnimalDTO, userId);
    res.status(201).json(animal);
  } catch (error) {
    next(error);
  }
}
