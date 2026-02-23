import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteWorkerService } from '../../../application/workers/services/DeleteWorkerService';

export const deleteWorkerController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const workerId = Number(req.params.id);

    const service = container.resolve(DeleteWorkerService);
    await service.execute(workerId, userId);

    res.status(204).send();
  } catch (error) {
    throw error;
  }
};
