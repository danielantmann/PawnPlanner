export interface OwnerDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  pets: { id: number; name: string }[];
}

export interface CreateOwnerPayload {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateOwnerPayload {
  name?: string;
  email?: string;
  phone?: string;
}

export interface OwnerFormState {
  name: string;
  email: string;
  phone: string;
}

export type OwnerFormAction =
  | { type: 'SET_FIELD'; field: keyof OwnerFormState; value: string }
  | { type: 'RESET' }
  | { type: 'SET_STATE'; state: OwnerFormState };
