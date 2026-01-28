import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UpdateServiceService } from '../../../application/services/services/UpdateServiceService';
import { UpdateServiceDTO } from '../../../application/services/dto/UpdateServiceDTO';

export async function updateServiceController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const service = container.resolve(UpdateServiceService);
    const result = await service.execute(id, req.body as UpdateServiceDTO, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
