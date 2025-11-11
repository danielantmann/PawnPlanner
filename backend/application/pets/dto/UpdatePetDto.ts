export interface UpdatePetDTO {
  id: number;
  name?: string;
  birthDate?: Date;
  ownerId?: number;
  breedId?: number;
  importantNotes?: string;
  quickNotes?: string;
}
