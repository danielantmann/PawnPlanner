export class OwnerResponseDTO {
  id!: number | null;
  name!: string;
  email!: string;
  phone!: string;
  pets?: {
    id: number;
    name: string;
  }[];
}
