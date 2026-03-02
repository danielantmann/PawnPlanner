export interface BreedDTO {
  id: number;
  name: string;
  animal: {
    id: number;
    species: string;
  };
}
