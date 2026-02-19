import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateWorkerService } from '../../../application/workers/services/UpdateWorkerService';
import { UpdateWorkerDTO } from '../../../application/workers/dto/UpdateWorkerDTO';

export const updateWorkerController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const workerId = Number(req.params.id);
    const dto: UpdateWorkerDTO = req.body;

    const service = container.resolve(UpdateWorkerService);
    const result = await service.execute(workerId, dto, userId);

    res.status(200).json(result);
  } catch (error) {
    throw error;
  }
};
