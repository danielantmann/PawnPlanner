import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetAppointmentsByRangeService } from '../../../application/appointments/services/GetAppointmentsByRangeService';

export async function getAppointmentsByRange(req: Request, res: Response, next: NextFunction) {
  try {
    const { start, end } = req.query as { start: string; end: string };
    const userId = req.user!.id;

    const service = container.resolve(GetAppointmentsByRangeService);
    const result = await service.execute(start, end, userId);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
