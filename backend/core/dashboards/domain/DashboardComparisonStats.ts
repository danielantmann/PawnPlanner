import { DashboardPeriodStats } from './DashboardPeriodStats';

export class DashboardComparisonStats {
  constructor(
    public readonly from: DashboardPeriodStats,
    public readonly to: DashboardPeriodStats,
    public readonly differenceAbsolute: number,
    public readonly differencePercentage: number
  ) {}
}
