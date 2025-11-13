export class OwnerResponseDTO {
  id!: number;
  name!: string;
  email!: string;
  phone!: string;
  pets?: {
    id: number;
    name: string;
  }[];
}
