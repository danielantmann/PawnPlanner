import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetCompletedAppointmentsInRangeService } from '../../../application/appointments/services/GetCompletedAppointmentsInRangeService';

export async function getCompletedAppointmentsByRange(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { start, end } = req.query as { start: string; end: string };
    const userId = req.user!.id;

    const service = container.resolve(GetCompletedAppointmentsInRangeService);
    const result = await service.execute(start, end, userId);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
