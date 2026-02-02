import { injectable, inject } from 'tsyringe';
import { IDashboardRepository } from '../../../core/dashboards/domain/IDashboardRepository';
import { DashboardMapper } from '../mappers/DashboardMapper';
import { DashboardTodayDTO } from '../dto/DashboardTodayDTO';

@injectable()
export class GetDashboardTodayService {
  constructor(
    @inject('DashboardRepository')
    private dashboard: IDashboardRepository
  ) {}

  async execute(userId: number): Promise<DashboardTodayDTO> {
    const stats = await this.dashboard.getTodayStats(userId);
    return DashboardMapper.toTodayDTO(stats);
  }
}
