import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CompareDashboardPeriodsService } from '../../../application/dashboards/services/CompareDashboardPeriodsService';

export async function compareDashboardPeriods(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const { fromStart, fromEnd, toStart, toEnd } = req.query;

    const service = container.resolve(CompareDashboardPeriodsService);

    const result = await service.execute(
      userId,
      {
        start: new Date(String(fromStart)),
        end: new Date(String(fromEnd)),
      },
      {
        start: new Date(String(toStart)),
        end: new Date(String(toEnd)),
      }
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
