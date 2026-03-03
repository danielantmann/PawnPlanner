export class OwnerResponseDTO {
  id!: number | null;
  name!: string;
  email!: string | null;
  phone!: string;
  pets?: {
    id: number;
    name: string;
  }[];
}
