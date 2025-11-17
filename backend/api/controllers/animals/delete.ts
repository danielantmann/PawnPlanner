import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DeleteAnimalService } from '../../../application/animals/services/DeleteAnimalService';

export async function deleteAnimal(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(DeleteAnimalService);
    await service.execute(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
