import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DeleteServiceService } from '../../../application/services/services/DeleteServiceService';

export async function deleteServiceController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const service = container.resolve(DeleteServiceService);
    await service.execute(id, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
