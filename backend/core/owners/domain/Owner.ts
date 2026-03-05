export class Owner {
  constructor(
    public id: number | null,
    public name: string,
    public searchName: string,
    public email: string | null,
    public phone: string,
    public userId: number
  ) {}
}
