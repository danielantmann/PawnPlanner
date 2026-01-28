import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetUserByIdService } from '../../../application/users/services/GetUserByIdService';

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = container.resolve(GetUserByIdService);

    // El servicio YA devuelve un DTO
    const dto = await service.execute(req.user!.id);

    // El controlador SOLO devuelve el DTO
    res.json(dto);
  } catch (err) {
    next(err);
  }
};
