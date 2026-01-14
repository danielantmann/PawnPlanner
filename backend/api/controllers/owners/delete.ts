import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DeleteOwnerService } from '../../../application/owners/services/DeleteOwnerService';

export async function deleteOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const service = container.resolve(DeleteOwnerService);
    await service.execute(id, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
