import { DashboardPeriodStats } from './DashboardPeriodStats';
import { DashboardComparisonStats } from './DashboardComparisonStats';

export interface IDashboardRepository {
  getTodayStats(userId: number): Promise<DashboardPeriodStats>;
  getWeeklyStats(userId: number): Promise<DashboardPeriodStats>;
  getMonthlyStats(userId: number): Promise<DashboardPeriodStats>;
  getYearlyStats(userId: number): Promise<DashboardPeriodStats>;

  comparePeriods(
    userId: number,
    from: { start: Date; end: Date },
    to: { start: Date; end: Date }
  ): Promise<DashboardComparisonStats>;
}
