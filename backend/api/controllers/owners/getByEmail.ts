import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetOwnerByEmailService } from '../../../application/owners/services/GetOwnerByEmailService';

export async function getOwnerByEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const service = container.resolve(GetOwnerByEmailService);
    const result = await service.execute(req.params.email, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
