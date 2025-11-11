export interface CreatePetDTO {
  name: string;
  birthDate?: Date;
  ownerId: number;
  breedId: number;
  importantNotes?: string;
  quickNotes?: string;
}
