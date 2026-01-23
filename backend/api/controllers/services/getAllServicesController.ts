import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAllServicesService } from '../../../application/services/services/GetAllServicesService';

export async function getAllServicesController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const service = container.resolve(GetAllServicesService);
    const result = await service.execute(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
