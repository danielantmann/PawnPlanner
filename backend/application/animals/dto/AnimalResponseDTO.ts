export class AnimalResponseDTO {
  id!: number;
  species!: string;
  breeds?: {
    id: number | null;
    name: string;
  }[];
}
