export interface OwnerWithPetsResponseDTO {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  pets: {
    id: number | null;
    name: string;
  }[];
}
