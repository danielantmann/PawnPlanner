import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateOwnerWithPetService } from '../../../application/owners/services/CreateOwnerWithPetService';

export async function createOwnerWithPet(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(CreateOwnerWithPetService);
    const userId = req.user!.id;
    const result = await service.execute(req.body, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
