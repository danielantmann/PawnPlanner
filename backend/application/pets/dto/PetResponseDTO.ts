export interface PetResponseDTO {
  id: number;
  name: string;
  birthDate?: Date;
  owner: string;
  breed: string;
  importantNotes?: string;
  quickNotes?: string;
}
