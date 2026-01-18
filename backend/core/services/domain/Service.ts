export class Service {
  constructor(
    public id: number | null,
    public name: string,
    public description: string | null,
    public price: number,
    public userId: number
  ) {}
}
