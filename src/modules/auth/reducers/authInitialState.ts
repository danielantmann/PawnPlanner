import type { AuthFormState } from '../types/auth.types';

export const authInitialState: AuthFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirm: '',
};
