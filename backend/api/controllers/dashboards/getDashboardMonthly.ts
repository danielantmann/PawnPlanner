import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetDashboardMonthlyService } from '../../../application/dashboards/services/GetDashboardMonthlyService';

export async function getDashboardMonthly(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const service = container.resolve(GetDashboardMonthlyService);
    const result = await service.execute(userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
