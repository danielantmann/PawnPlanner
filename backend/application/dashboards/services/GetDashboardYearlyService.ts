import { injectable, inject } from 'tsyringe';
import { IDashboardRepository } from '../../../core/dashboards/domain/IDashboardRepository';
import { DashboardMapper } from '../mappers/DashboardMapper';
import { DashboardYearlyDTO } from '../dto/DashboardYearlyDTO';

@injectable()
export class GetDashboardYearlyService {
  constructor(
    @inject('DashboardRepository')
    private dashboard: IDashboardRepository
  ) {}

  async execute(userId: number): Promise<DashboardYearlyDTO> {
    const stats = await this.dashboard.getYearlyStats(userId);
    return DashboardMapper.toYearlyDTO(stats);
  }
}
