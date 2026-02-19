export interface WorkerDTO {
  id: number;
  name: string;
  phone?: string;
  isActive: boolean;
  maxSimultaneous: number | null;
}
