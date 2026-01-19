export class User {
  constructor(
    public id: number | null,
    public firstName: string,
    public lastName: string,
    public secondLastName: string | null,
    public email: string,
    public passwordHash: string
  ) {}
}
