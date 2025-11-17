import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetOwnerByIdService } from '../../../application/owners/services/GetOwnerByIdService';

export async function getOwnerById(req: Request, res: Response, next: NextFunction) {
  try {
    const service = container.resolve(GetOwnerByIdService);
    const result = await service.execute(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
