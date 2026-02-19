import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetWorkerByIdService } from '../../../application/workers/services/GetWorkerByIdService';

export const getWorkerByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const workerId = Number(req.params.id);

    const service = container.resolve(GetWorkerByIdService);
    const result = await service.execute(workerId, userId);

    res.status(200).json(result);
  } catch (error) {
    throw error;
  }
};
