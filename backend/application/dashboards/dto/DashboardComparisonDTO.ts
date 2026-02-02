export class DashboardComparisonDTO {
  from!: any; // luego lo tipamos mejor si quieres
  to!: any;
  differenceAbsolute!: number;
  differencePercentage!: number;
}
