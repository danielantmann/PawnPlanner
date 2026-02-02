import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetDashboardWeeklyService } from '../../../application/dashboards/services/GetDashboardWeeklyService';

export async function getDashboardWeekly(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const service = container.resolve(GetDashboardWeeklyService);
    const result = await service.execute(userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
