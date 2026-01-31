import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { IDashboardRepository } from '../core/dashboards/domain/IDashboardRepository';
import { DashboardRepository } from '../infrastructure/repositories/DashboardRepository';
import { GetDashboardTodayService } from '../application/dashboards/services/GetDashboardTodayService';
import { GetDashboardWeeklyService } from '../application/dashboards/services/GetDashboardWeeklyService';
import { GetDashboardMonthlyService } from '../application/dashboards/services/GetDashboardMonthlyService';
import { GetDashboardYearlyService } from '../application/dashboards/services/GetDashboardYearlyService';
import { CompareDashboardPeriodsService } from '../application/dashboards/services/CompareDashboardPeriodsService';

export function setupDashboardContainer(dataSource: DataSource): void {
  container.register<IDashboardRepository>('DashboardRepository', {
    useClass: DashboardRepository,
  });

  container.register(GetDashboardTodayService, { useClass: GetDashboardTodayService });
  container.register(GetDashboardWeeklyService, { useClass: GetDashboardWeeklyService });
  container.register(GetDashboardMonthlyService, { useClass: GetDashboardMonthlyService });
  container.register(GetDashboardYearlyService, { useClass: GetDashboardYearlyService });
  container.register(CompareDashboardPeriodsService, { useClass: CompareDashboardPeriodsService });
}
