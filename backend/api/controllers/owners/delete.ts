import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DeleteOwnerService } from '../../../application/owners/services/DeleteOwnerService';

export async function deleteOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(DeleteOwnerService);
    await service.execute(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
