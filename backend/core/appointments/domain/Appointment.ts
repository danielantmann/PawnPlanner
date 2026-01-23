export class Appointment {
  constructor(
    public id: number | null,
    public userId: number,
    public petId: number,
    public ownerId: number,
    public serviceId: number,

    public petName: string,
    public breedName: string,
    public ownerName: string,
    public ownerPhone: string,

    public serviceName: string,
    public estimatedPrice: number,
    public finalPrice: number,

    public startTime: Date,
    public endTime: Date,
    public durationMinutes: number,

    public status: 'completed' | 'no-show' | 'cancelled' = 'completed',
    public reminderSent: boolean = false
  ) {}
}
