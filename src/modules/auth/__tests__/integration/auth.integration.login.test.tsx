import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthForm } from '../../components/AuthForm';
import { useLogin } from '../../hooks/useLogin';
import { useAuthStore } from '../../store/auth.store';
import { router } from 'expo-router';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
  AntDesign: () => null,
  MaterialIcons: () => null,
  FontAwesome: () => null,
  Entypo: () => null,
}));

jest.mock('@assets/logo/paw-print.svg', () => 'SvgMock');

jest.mock('nativewind', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('../../store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('../../hooks/useLogin');

function createTestClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function wrapperFactory(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('Auth Integration - Login Flow', () => {
  const mockSetSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockSetSession);

    (useLogin as jest.Mock).mockReturnValue({
      mutate: () => {
        const fakeSession = { token: 'abc123', user: { id: 1, name: 'Test' } };
        mockSetSession(fakeSession);
        router.replace('/home');
      },
      isError: false,
      reset: jest.fn(),
    });
  });

  it('submits login form, sets session and redirects', async () => {
    const client = createTestClient();
    const wrapper = wrapperFactory(client);

    const { getByPlaceholderText, getByText } = render(<AuthForm mode="login" />, { wrapper });

    fireEvent.changeText(getByPlaceholderText('auth.email'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('auth.password'), 'Abc123!');
    fireEvent.press(getByText('auth.loginButton'));

    await waitFor(() => {
      expect(mockSetSession).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error when email is invalid', async () => {
    const client = createTestClient();
    const wrapper = wrapperFactory(client);

    const { getByPlaceholderText, getByText, queryByText } = render(<AuthForm mode="login" />, {
      wrapper,
    });

    fireEvent.changeText(getByPlaceholderText('auth.email'), 'not-an-email');
    fireEvent.changeText(getByPlaceholderText('auth.password'), 'Abc123!');
    fireEvent.press(getByText('auth.loginButton'));

    await waitFor(() => {
      expect(getByText('auth.errors.emailInvalid')).toBeTruthy();
      expect(queryByText('auth.errors.passwordInvalid')).toBeNull();
    });

    expect(mockSetSession).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('shows error when password is invalid', async () => {
    const client = createTestClient();
    const wrapper = wrapperFactory(client);

    const { getByPlaceholderText, getByText, queryByText } = render(<AuthForm mode="login" />, {
      wrapper,
    });

    fireEvent.changeText(getByPlaceholderText('auth.email'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('auth.password'), '123');
    fireEvent.press(getByText('auth.loginButton'));

    await waitFor(() => {
      expect(getByText('auth.errors.passwordInvalid')).toBeTruthy();
      expect(queryByText('auth.errors.emailInvalid')).toBeNull();
    });

    expect(mockSetSession).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('shows both errors when email and password are invalid', async () => {
    const client = createTestClient();
    const wrapper = wrapperFactory(client);

    const { getByPlaceholderText, getByText } = render(<AuthForm mode="login" />, { wrapper });

    fireEvent.changeText(getByPlaceholderText('auth.email'), 'bad-email');
    fireEvent.changeText(getByPlaceholderText('auth.password'), '123');
    fireEvent.press(getByText('auth.loginButton'));

    await waitFor(() => {
      expect(getByText('auth.errors.emailInvalid')).toBeTruthy();
      expect(getByText('auth.errors.passwordInvalid')).toBeTruthy();
    });

    expect(mockSetSession).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });
});
