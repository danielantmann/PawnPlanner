import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetOwnerByIdService } from '../../../application/owners/services/GetOwnerByIdService';

export async function getOwnerById(req: Request, res: Response, next: NextFunction) {
  try {
    const idParams = req.params.id;
    const id = Number(idParams);

    if (!idParams || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid owner id format' });
    }
    const service = container.resolve(GetOwnerByIdService);
    const result = await service.execute(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
