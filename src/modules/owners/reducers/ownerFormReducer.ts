import type { OwnerFormState, OwnerFormAction } from '../types/owner.types';
import { ownerInitialState } from './ownerInitialState';

export function ownerFormReducer(state: OwnerFormState, action: OwnerFormAction): OwnerFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return ownerInitialState;
    case 'SET_STATE':
      return action.state;
    default:
      return state;
  }
}
