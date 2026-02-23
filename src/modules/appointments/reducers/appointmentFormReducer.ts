import type { AppointmentFormState, AppointmentFormAction } from '../types/appointment.types';
import { appointmentInitialState } from './appointmentInitialState';

export function appointmentFormReducer(
  state: AppointmentFormState,
  action: AppointmentFormAction
): AppointmentFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'RESET':
      return appointmentInitialState;

    case 'SET_STATE':
      return action.state;

    default:
      return state;
  }
}
