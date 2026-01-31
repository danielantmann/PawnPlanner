import { injectable, inject } from 'tsyringe';
import { IDashboardRepository } from '../../../core/dashboards/domain/IDashboardRepository';
import { DashboardMapper } from '../mappers/DashboardMapper';
import { DashboardComparisonDTO } from '../dto/DashboardComparisonDTO';
import { BadRequestError } from '../../../shared/errors/BadRequestError';

@injectable()
export class CompareDashboardPeriodsService {
  constructor(
    @inject('DashboardRepository')
    private dashboard: IDashboardRepository
  ) {}

  async execute(
    userId: number,
    from: { start: Date; end: Date },
    to: { start: Date; end: Date }
  ): Promise<DashboardComparisonDTO> {
    // -------------------------
    // Validaciones de fechas
    // -------------------------

    if (!(from.start instanceof Date) || isNaN(from.start.getTime())) {
      throw new BadRequestError('Invalid from.start date');
    }

    if (!(from.end instanceof Date) || isNaN(from.end.getTime())) {
      throw new BadRequestError('Invalid from.end date');
    }

    if (!(to.start instanceof Date) || isNaN(to.start.getTime())) {
      throw new BadRequestError('Invalid to.start date');
    }

    if (!(to.end instanceof Date) || isNaN(to.end.getTime())) {
      throw new BadRequestError('Invalid to.end date');
    }

    if (from.start >= from.end) {
      throw new BadRequestError('Invalid "from" range: start must be before end');
    }

    if (to.start >= to.end) {
      throw new BadRequestError('Invalid "to" range: start must be before end');
    }

    // -------------------------
    // Lógica principal
    // -------------------------

    const stats = await this.dashboard.comparePeriods(userId, from, to);
    return DashboardMapper.toComparisonDTO(stats);
  }
}
