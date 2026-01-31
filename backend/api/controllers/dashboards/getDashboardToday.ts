import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetDashboardTodayService } from '../../../application/dashboards/services/GetDashboardTodayService';

export async function getDashboardToday(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const service = container.resolve(GetDashboardTodayService);
    const result = await service.execute(userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
