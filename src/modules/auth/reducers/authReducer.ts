import type { AuthFormState, AuthFormAction } from '../types/auth.types';
import { authInitialState } from './authInitialState';

export function authReducer(state: AuthFormState, action: AuthFormAction): AuthFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'RESET':
      return authInitialState;

    default:
      return state;
  }
}
