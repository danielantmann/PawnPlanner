export interface BreedResponseDTO {
  id: number;
  name: string;
  animal: {
    id: number;
    species: string;
  };
}
