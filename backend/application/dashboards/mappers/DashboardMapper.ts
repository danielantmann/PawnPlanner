import { DashboardPeriodStats } from '../../../core/dashboards/domain/DashboardPeriodStats';
import { DashboardComparisonStats } from '../../../core/dashboards/domain/DashboardComparisonStats';

import { DashboardTodayDTO } from '../dto/DashboardTodayDTO';
import { DashboardWeeklyDTO } from '../dto/DashboardWeeklyDTO';
import { DashboardMonthlyDTO } from '../dto/DashboardMonthlyDTO';
import { DashboardYearlyDTO } from '../dto/DashboardYearlyDTO';
import { DashboardComparisonDTO } from '../dto/DashboardComparisonDTO';

export class DashboardMapper {
  static toTodayDTO(stats: DashboardPeriodStats): DashboardTodayDTO {
    return {
      income: stats.income,
      appointments: stats.appointments,
      completed: stats.completed,
      cancelled: stats.cancelled,
      noShow: stats.noShow,
      durationMinutes: stats.durationMinutes,
      revenuePerHour: stats.revenuePerHour,
      ticketAverage: stats.ticketAverage,
      topService: stats.topService,
    };
  }

  static toWeeklyDTO(stats: DashboardPeriodStats): DashboardWeeklyDTO {
    return {
      income: stats.income,
      appointments: stats.appointments,
      completed: stats.completed,
      cancelled: stats.cancelled,
      noShow: stats.noShow,
      durationMinutes: stats.durationMinutes,
      revenuePerHour: stats.revenuePerHour,
      ticketAverage: stats.ticketAverage,
      topService: stats.topService,
      activity: stats.activity || Array(7).fill(0),
    };
  }

  static toMonthlyDTO(stats: DashboardPeriodStats): DashboardMonthlyDTO {
    return {
      income: stats.income,
      appointments: stats.appointments,
      completed: stats.completed,
      cancelled: stats.cancelled,
      noShow: stats.noShow,
      durationMinutes: stats.durationMinutes,
      revenuePerHour: stats.revenuePerHour,
      ticketAverage: stats.ticketAverage,
      topService: stats.topService,
    };
  }

  static toYearlyDTO(stats: DashboardPeriodStats): DashboardYearlyDTO {
    return {
      income: stats.income,
      appointments: stats.appointments,
      completed: stats.completed,
      cancelled: stats.cancelled,
      noShow: stats.noShow,
      durationMinutes: stats.durationMinutes,
      revenuePerHour: stats.revenuePerHour,
      ticketAverage: stats.ticketAverage,
      topService: stats.topService,
    };
  }

  static toComparisonDTO(stats: DashboardComparisonStats): DashboardComparisonDTO {
    return {
      from: this.toMonthlyDTO(stats.from), // puedes cambiar según el tipo
      to: this.toMonthlyDTO(stats.to),
      differenceAbsolute: stats.differenceAbsolute,
      differencePercentage: stats.differencePercentage,
    };
  }
}
