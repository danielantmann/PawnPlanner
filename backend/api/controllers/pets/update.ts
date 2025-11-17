import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UpdatePetService } from '../../../application/pets/services/UpdatePetService';
import { UpdatePetDTO } from '../../../application/pets/dto/UpdatePetDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export async function updatePet(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(UpdatePetService);
    const id = Number(req.params.id);
    const pet = await service.execute(id, req.body as UpdatePetDTO);
    res.status(200).json(pet);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
}
