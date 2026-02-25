import { renderHook, act } from '@testing-library/react-native';
import { useAuthForm } from '../../hooks/useAuthForm';
import { useLogin } from '../../hooks/useLogin';
import { useRegister } from '../../hooks/useRegister';

// Mocks
jest.mock('../../hooks/useLogin', () => ({
  useLogin: jest.fn(),
}));

jest.mock('../../hooks/useRegister', () => ({
  useRegister: jest.fn(),
}));

describe('useAuthForm', () => {
  const mockLoginMutate = jest.fn();
  const mockLoginReset = jest.fn();

  const mockRegisterMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLogin as jest.Mock).mockReturnValue({
      mutate: mockLoginMutate,
      reset: mockLoginReset,
      isError: false,
    });

    (useRegister as jest.Mock).mockReturnValue({
      mutate: mockRegisterMutate,
    });
  });

  it('calls loginMutation.mutate when mode is login', async () => {
    const { result } = renderHook(() => useAuthForm('login'));

    await act(async () => {
      await result.current.onValidSubmit({
        email: '  test@test.com  ',
        password: '123456',
        firstName: '',
        lastName: '',
      });
    });

    expect(mockLoginMutate).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123456',
    });
  });

  it('calls registerMutation.mutate when mode is register', async () => {
    const { result } = renderHook(() => useAuthForm('register'));

    await act(async () => {
      await result.current.onValidSubmit({
        email: '  test@test.com  ',
        password: '123456',
        firstName: '  John ',
        lastName: ' Doe  ',
      });
    });

    expect(mockRegisterMutate).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('clearLoginError calls loginMutation.reset only when isError = true', () => {
    (useLogin as jest.Mock).mockReturnValue({
      mutate: mockLoginMutate,
      reset: mockLoginReset,
      isError: true,
    });

    const { result } = renderHook(() => useAuthForm('login'));

    act(() => {
      result.current.clearLoginError();
    });

    expect(mockLoginReset).toHaveBeenCalled();
  });

  it('clearLoginError does nothing when isError = false', () => {
    (useLogin as jest.Mock).mockReturnValue({
      mutate: mockLoginMutate,
      reset: mockLoginReset,
      isError: false,
    });

    const { result } = renderHook(() => useAuthForm('login'));

    act(() => {
      result.current.clearLoginError();
    });

    expect(mockLoginReset).not.toHaveBeenCalled();
  });
});
