export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type AuthMode = 'login' | 'register';

export type AuthFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
};

export type AuthFormAction =
  | { type: 'SET_FIELD'; field: keyof AuthFormState; value: string }
  | { type: 'RESET' };

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
