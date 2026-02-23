export class WorkerResponseDTO {
  id!: number;
  name!: string;
  phone?: string;
  isActive!: boolean;
  maxSimultaneous: number | null = null;
}
