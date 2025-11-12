export interface PetResponseDTO {
  id: number;
  name: string;
  birthDate?: Date;
  ownerName: string;
  ownerPhone: string;
  breed: string;
  importantNotes?: string;
  quickNotes?: string;
}
