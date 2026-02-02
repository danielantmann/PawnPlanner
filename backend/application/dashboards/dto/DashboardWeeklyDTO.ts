export class DashboardWeeklyDTO {
  income!: number;
  appointments!: number;
  completed!: number;
  cancelled!: number;
  noShow!: number;
  durationMinutes!: number;
  revenuePerHour!: number;
  ticketAverage!: number;
  topService!: string | null;
  activity!: number[]; // 7 días
}
