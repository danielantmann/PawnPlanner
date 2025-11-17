import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreatePetService } from '../../../application/pets/services/CreatePetService';
import { CreatePetDTO } from '../../../application/pets/dto/CreatePetDTO';

export async function createPet(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(CreatePetService);
    const pet = await service.execute(req.body as CreatePetDTO);
    res.status(201).json(pet);
  } catch (error) {
    next(error);
  }
}
