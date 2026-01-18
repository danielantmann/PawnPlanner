export class Appointment {
  constructor(
    public id: number | null,
    public startTime: Date,
    public endTime: Date,
    public notes: string | null,
    public petId: number,
    public serviceId: number,
    public userId: number
  ) {}
}
