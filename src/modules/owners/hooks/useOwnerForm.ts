import { useReducer, useEffect, useRef, useCallback } from 'react';
import { ownerFormReducer } from '../reducers/ownerFormReducer';
import { ownerInitialState } from '../reducers/ownerInitialState';
import type { OwnerDTO, OwnerFormState } from '../types/owner.types';

interface UseOwnerFormProps {
  owner?: OwnerDTO | null;
  isEditMode?: boolean;
  visible?: boolean;
}

export function useOwnerForm({ owner, isEditMode = false, visible }: UseOwnerFormProps) {
  const [formState, dispatch] = useReducer(ownerFormReducer, ownerInitialState);
  const [formErrors, setFormErrors] = useReducer(
    (_: Record<string, string[]>, next: Record<string, string[]>) => next,
    {}
  );
  const hasInitialized = useRef(false);

  const setFormField = useCallback((field: keyof OwnerFormState, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
    setFormErrors({});
  }, []);

  // Reset cuando el modal se cierra
  useEffect(() => {
    if (!visible) {
      hasInitialized.current = false;
      resetForm();
    }
  }, [visible, resetForm]);

  // Inicialización cuando el modal se abre
  useEffect(() => {
    if (!visible || hasInitialized.current) return;
    hasInitialized.current = true;

    if (isEditMode && owner) {
      dispatch({
        type: 'SET_STATE',
        state: {
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
        },
      });
    }
  }, [visible, isEditMode, owner]);

  return {
    formState,
    formErrors,
    setFormField,
    setFormErrors,
    resetForm,
  };
}
