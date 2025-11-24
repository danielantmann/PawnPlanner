export interface PetResponseDTO {
  id: number;
  name: string;
  birthDate?: Date;
  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  breed: string;
  importantNotes?: string;
  quickNotes?: string;
}
