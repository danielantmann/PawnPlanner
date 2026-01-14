import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetOwnerByIdService } from '../../../application/owners/services/GetOwnerByIdService';

export async function getOwnerById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid owner id format' });
    }

    const userId = req.user!.id;

    const service = container.resolve(GetOwnerByIdService);
    const result = await service.execute(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
