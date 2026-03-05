import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useOwnerForm } from '../../hooks/useOwnerForm';

jest.mock('@/src/i18n', () => ({
  t: (key: string) => key,
  default: { t: (key: string) => key },
}));

const mockOwner = { id: 1, name: 'Juan', phone: '612345678', email: 'juan@test.com', pets: [] };

describe('useOwnerForm', () => {
  it('initializes with empty values in create mode', () => {
    const { result } = renderHook(() => useOwnerForm({ isEditMode: false, visible: true }));

    expect(result.current.form.getValues()).toEqual({ name: '', email: '', phone: '' });
  });

  it('initializes with owner values in edit mode when visible', async () => {
    const { result, rerender } = renderHook((props: any) => useOwnerForm(props), {
      initialProps: { owner: mockOwner, isEditMode: true, visible: false },
    });

    rerender({ owner: mockOwner, isEditMode: true, visible: true });

    await waitFor(() => {
      expect(result.current.form.getValues('name')).toBe('Juan');
      expect(result.current.form.getValues('phone')).toBe('612345678');
      expect(result.current.form.getValues('email')).toBe('juan@test.com');
    });
  });

  it('converts null email to empty string in edit mode', async () => {
    const { result, rerender } = renderHook((props: any) => useOwnerForm(props), {
      initialProps: { owner: { ...mockOwner, email: null }, isEditMode: true, visible: false },
    });

    rerender({ owner: { ...mockOwner, email: null }, isEditMode: true, visible: true });

    await waitFor(() => {
      expect(result.current.form.getValues('email')).toBe('');
    });
  });

  it('resets form when modal closes', async () => {
    const { result, rerender } = renderHook((props: any) => useOwnerForm(props), {
      initialProps: { visible: true, isEditMode: false },
    });

    act(() => {
      result.current.form.setValue('name', 'Test');
    });

    rerender({ visible: false, isEditMode: false });

    await waitFor(() => {
      expect(result.current.form.getValues('name')).toBe('');
    });
  });

  it('does not reinitialize when visible stays true', () => {
    const { result, rerender } = renderHook((props: any) => useOwnerForm(props), {
      initialProps: { visible: true, isEditMode: false },
    });

    act(() => {
      result.current.form.setValue('name', 'Modified');
    });

    rerender({ visible: true, isEditMode: false });

    expect(result.current.form.getValues('name')).toBe('Modified');
  });

  it('validates required name on submit', async () => {
    const { result } = renderHook(() => useOwnerForm({ isEditMode: false, visible: true }));

    // phone es obligatorio en el schema
    act(() => {
      result.current.form.setValue('phone', '612345678');
    });

    await act(async () => {
      await result.current.form.handleSubmit(() => {})();
    });

    // Leer error de forma estable
    const nameError = result.current.form.getFieldState('name').error;
    expect(nameError).toBeTruthy();
  });

  it('validates email format on submit', async () => {
    const { result } = renderHook(() => useOwnerForm({ isEditMode: false, visible: true }));

    act(() => {
      result.current.form.setValue('name', 'Juan');
      result.current.form.setValue('phone', '612345678');
      result.current.form.setValue('email', 'notanemail');
    });

    await act(async () => {
      await result.current.form.handleSubmit(() => {})();
    });

    const emailError = result.current.form.getFieldState('email').error;
    expect(emailError).toBeTruthy();
  });
});
