export class Pet {
  constructor(
    public id: number | null,
    public name: string,
    public searchName: string,
    public birthDate: Date | null,
    public importantNotes: string | null,
    public quickNotes: string | null,
    public ownerId: number,
    public breedId: number,
    public userId: number
  ) {}
}
