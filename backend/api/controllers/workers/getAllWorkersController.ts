import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllWorkersService } from '../../../application/workers/services/GetAllWorkersService';

export const getAllWorkersController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const service = container.resolve(GetAllWorkersService);
    const result = await service.execute(userId);

    res.status(200).json(result);
  } catch (error) {
    throw error;
  }
};
