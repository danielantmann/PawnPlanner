export interface OwnerWithPetsResponseDTO {
  id: number | null;
  name: string;
  email: string | null;
  phone: string;
  pets: {
    id: number | null;
    name: string;
  }[];
}
