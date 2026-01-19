export interface PetResponseDTO {
  id: number;
  name: string;
  birthDate: Date | null;
  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  breed: string;
  importantNotes: string;
  quickNotes: string;
}
