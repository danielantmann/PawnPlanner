import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UpdateOwnerService } from '../../../application/owners/services/UpdateOwnerService';
import { UpdateOwnerDTO } from '../../../application/owners/dto/UpdateOwnerDTO';

export async function updateOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const service = container.resolve(UpdateOwnerService);
    const result = await service.execute(id, req.body as UpdateOwnerDTO, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
