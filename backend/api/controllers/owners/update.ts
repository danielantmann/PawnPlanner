import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UpdateOwnerService } from '../../../application/owners/services/UpdateOwnerService';
import { UpdateOwnerDTO } from '../../../application/owners/dto/UpdateOwnerDTO';

export async function updateOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(UpdateOwnerService);
    const result = await service.execute(Number(req.params.id), req.body as UpdateOwnerDTO);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
