import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DeletePetService } from '../../../application/pets/services/DeletePetService';

export async function deletePet(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const service = container.resolve(DeletePetService);
    await service.execute(Number(req.params.id), userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
