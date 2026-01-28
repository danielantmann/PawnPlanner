import { Animal } from '../../animals/domain/Animal';
export class Breed {
  constructor(
    public id: number | null,
    public name: string,
    public searchName: string,
    public animalId: number,
    public userId: number | null,
    public animal?: Animal
  ) {}
}
