import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateWorkerService } from '../../../application/workers/services/CreateWorkerService';
import { CreateWorkerDTO } from '../../../application/workers/dto/CreateWorkerDTO';

export const createWorkerController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const dto: CreateWorkerDTO = req.body;

    const service = container.resolve(CreateWorkerService);
    const result = await service.execute(dto, userId);

    res.status(201).json(result);
  } catch (error) {
    throw error;
  }
};
