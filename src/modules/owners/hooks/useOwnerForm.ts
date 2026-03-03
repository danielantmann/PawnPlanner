import { useReducer, useEffect, useRef, useCallback, useState } from 'react';
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
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const hasInitialized = useRef(false);

  // Clear on change — borra el error del campo al escribir
  const setFormField = useCallback((field: keyof OwnerFormState, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
    setFormErrors({});
  }, []);

  useEffect(() => {
    if (!visible) {
      hasInitialized.current = false;
      resetForm();
    }
  }, [visible, resetForm]);

  useEffect(() => {
    if (!visible || hasInitialized.current) return;
    hasInitialized.current = true;

    if (isEditMode && owner) {
      dispatch({
        type: 'SET_STATE',
        state: {
          name: owner.name,
          email: owner.email ?? '',
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
