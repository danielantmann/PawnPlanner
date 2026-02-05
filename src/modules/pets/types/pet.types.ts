export interface PetSearchResult {
  id: number;
  name: string;
  birthDate: string | null;
  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  breed: string | null;
  importantNotes: string;
  quickNotes: string;
}
