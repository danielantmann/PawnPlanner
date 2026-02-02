import { injectable, inject } from 'tsyringe';
import { IDashboardRepository } from '../../../core/dashboards/domain/IDashboardRepository';
import { DashboardMapper } from '../mappers/DashboardMapper';
import { DashboardWeeklyDTO } from '../dto/DashboardWeeklyDTO';

@injectable()
export class GetDashboardWeeklyService {
  constructor(
    @inject('DashboardRepository')
    private dashboard: IDashboardRepository
  ) {}

  async execute(userId: number): Promise<DashboardWeeklyDTO> {
    const stats = await this.dashboard.getWeeklyStats(userId);
    return DashboardMapper.toWeeklyDTO(stats);
  }
}
