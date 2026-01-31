export class DashboardPeriodStats {
  constructor(
    public readonly income: number,
    public readonly appointments: number,
    public readonly completed: number,
    public readonly cancelled: number,
    public readonly noShow: number,
    public readonly durationMinutes: number,
    public readonly revenuePerHour: number,
    public readonly ticketAverage: number,
    public readonly topService: string | null,
    public activity?: number[] // solo para weekly
  ) {}
}
