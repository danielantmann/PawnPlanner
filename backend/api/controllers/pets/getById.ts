import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetPetByIdService } from '../../../application/pets/services/GetPetByIdService';

export async function getPetById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const service = container.resolve(GetPetByIdService);
    const pet = await service.execute(Number(req.params.id), userId);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
}
