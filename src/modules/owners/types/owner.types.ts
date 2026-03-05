export interface OwnerDTO {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  pets: { id: number; name: string }[];
}

export interface CreateOwnerPayload {
  name: string;
  email?: string | null;
  phone: string;
}

export interface UpdateOwnerPayload {
  name?: string;
  email?: string | null;
  phone?: string;
}
