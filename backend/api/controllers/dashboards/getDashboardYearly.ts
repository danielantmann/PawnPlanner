import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { GetDashboardYearlyService } from '../../../application/dashboards/services/GetDashboardYearlyService';

export async function getDashboardYearly(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const service = container.resolve(GetDashboardYearlyService);
    const result = await service.execute(userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
