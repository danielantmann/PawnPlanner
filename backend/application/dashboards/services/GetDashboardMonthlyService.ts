import { injectable, inject } from 'tsyringe';
import { IDashboardRepository } from '../../../core/dashboards/domain/IDashboardRepository';
import { DashboardMapper } from '../mappers/DashboardMapper';
import { DashboardMonthlyDTO } from '../dto/DashboardMonthlyDTO';

@injectable()
export class GetDashboardMonthlyService {
  constructor(
    @inject('DashboardRepository')
    private dashboard: IDashboardRepository
  ) {}

  async execute(userId: number): Promise<DashboardMonthlyDTO> {
    const stats = await this.dashboard.getMonthlyStats(userId);
    return DashboardMapper.toMonthlyDTO(stats);
  }
}
