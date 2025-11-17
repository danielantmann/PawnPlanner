import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateOwnerService } from '../../../application/owners/services/CreateOwnerService';
import { CreateOwnerDTO } from '../../../application/owners/dto/CreateOwnerDTO';

export async function createOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(CreateOwnerService);
    const result = await service.execute(req.body as CreateOwnerDTO);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
