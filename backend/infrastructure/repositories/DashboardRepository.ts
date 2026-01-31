import { injectable, inject } from 'tsyringe';
import { IDashboardRepository } from '../../core/dashboards/domain/IDashboardRepository';
import { DashboardPeriodStats } from '../../core/dashboards/domain/DashboardPeriodStats';
import { DashboardComparisonStats } from '../../core/dashboards/domain/DashboardComparisonStats';
import { IAppointmentRepository } from '../../core/appointments/domain/IAppointmentRepository';

@injectable()
export class DashboardRepository implements IDashboardRepository {
  constructor(
    @inject('AppointmentRepository')
    private appointments: IAppointmentRepository
  ) {}

  // -------------------------
  // Helpers
  // -------------------------

  private calculateStats(appointments: any[]): DashboardPeriodStats {
    if (appointments.length === 0) {
      return new DashboardPeriodStats(0, 0, 0, 0, 0, 0, 0, 0, null);
    }

    const income = appointments.reduce((sum, a) => sum + (a.finalPrice || 0), 0);
    const durationMinutes = appointments.reduce((sum, a) => sum + (a.durationMinutes || 0), 0);

    const completed = appointments.filter((a) => a.status === 'completed').length;
    const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
    const noShow = appointments.filter((a) => a.status === 'no-show').length;

    const revenuePerHour = durationMinutes > 0 ? income / (durationMinutes / 60) : 0;

    const ticketAverage = appointments.length > 0 ? income / appointments.length : 0;

    // Top service
    const serviceCount: Record<string, number> = {};
    for (const a of appointments) {
      if (!serviceCount[a.serviceName]) serviceCount[a.serviceName] = 0;
      serviceCount[a.serviceName]++;
    }

    const topService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return new DashboardPeriodStats(
      income,
      appointments.length,
      completed,
      cancelled,
      noShow,
      durationMinutes,
      revenuePerHour,
      ticketAverage,
      topService
    );
  }

  // -------------------------
  // Today
  // -------------------------

  async getTodayStats(userId: number): Promise<DashboardPeriodStats> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const appts = await this.appointments.findByDateRange(userId, start, end);
    return this.calculateStats(appts);
  }

  // -------------------------
  // Weekly
  // -------------------------

  async getWeeklyStats(userId: number): Promise<DashboardPeriodStats> {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const diff = day === 0 ? -6 : 1 - day;

    const start = new Date(now);
    start.setDate(now.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    const appts = await this.appointments.findByDateRange(userId, start, end);

    // Activity: citas por día
    const activity = Array(7).fill(0);
    for (const a of appts) {
      const index = (a.startTime.getDay() + 6) % 7; // lunes = 0
      activity[index]++;
    }

    const stats = this.calculateStats(appts);
    stats.activity = activity;

    return stats;
  }

  // -------------------------
  // Monthly
  // -------------------------

  async getMonthlyStats(userId: number): Promise<DashboardPeriodStats> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const appts = await this.appointments.findByDateRange(userId, start, end);
    return this.calculateStats(appts);
  }

  // -------------------------
  // Yearly
  // -------------------------

  async getYearlyStats(userId: number): Promise<DashboardPeriodStats> {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);

    const appts = await this.appointments.findByDateRange(userId, start, end);
    return this.calculateStats(appts);
  }

  // -------------------------
  // Compare periods
  // -------------------------

  async comparePeriods(
    userId: number,
    from: { start: Date; end: Date },
    to: { start: Date; end: Date }
  ): Promise<DashboardComparisonStats> {
    const fromAppts = await this.appointments.findByDateRange(userId, from.start, from.end);
    const toAppts = await this.appointments.findByDateRange(userId, to.start, to.end);

    const fromStats = this.calculateStats(fromAppts);
    const toStats = this.calculateStats(toAppts);

    const diffAbs = fromStats.income - toStats.income;
    const diffPct = toStats.income === 0 ? 100 : (diffAbs / toStats.income) * 100;

    return new DashboardComparisonStats(fromStats, toStats, diffAbs, diffPct);
  }
}
