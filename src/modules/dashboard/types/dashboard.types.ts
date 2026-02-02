export type DashboardBaseStats = {
  income: number;
  appointments: number;
  completed: number;
  cancelled: number;
  noShow: number;
  durationMinutes: number;
  revenuePerHour: number;
  ticketAverage: number;
  topService: string | null;
};

export type DashboardTodayResponse = DashboardBaseStats;

export type DashboardWeeklyResponse = DashboardBaseStats & {
  activity: number[];
};
