import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetServiceByIdService } from '../../../application/services/services/GetServiceByIdService';

export async function getServiceByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const service = container.resolve(GetServiceByIdService);
    const result = await service.execute(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
