import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UpdateAnimalService } from '../../../application/animals/services/UpdateAnimalService';
import { UpdateAnimalDTO } from '../../../application/animals/dto/UpdateAnimalDTO';

export async function updateAnimal(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(UpdateAnimalService);
    const id = Number(req.params.id);
    const animal = await service.execute(id, req.body as UpdateAnimalDTO);
    res.status(200).json(animal);
  } catch (error) {
    next(error);
  }
}
