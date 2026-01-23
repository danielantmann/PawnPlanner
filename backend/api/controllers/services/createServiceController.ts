import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateServiceService } from '../../../application/services/services/CreateServiceService';
import { CreateServiceDTO } from '../../../application/services/dto/CreateServiceDTO';

export async function createServiceController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const service = container.resolve(CreateServiceService);
    const result = await service.execute(req.body as CreateServiceDTO, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
