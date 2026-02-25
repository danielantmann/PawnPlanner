import { AUTH_ERROR_MAP } from '../../errors/authErrors';

describe('AUTH_ERROR_MAP', () => {
  it('contains the expected backend error keys', () => {
    expect(AUTH_ERROR_MAP['Invalid credentials']).toBe('auth.invalidCredentials');
    expect(AUTH_ERROR_MAP['User not found']).toBe('auth.userNotFound');
    expect(AUTH_ERROR_MAP['Email already exists']).toBe('auth.emailExists');
  });

  it('does not contain unknown backend errors', () => {
    expect(AUTH_ERROR_MAP['Something weird']).toBeUndefined();
    expect(AUTH_ERROR_MAP['']).toBeUndefined();
    expect(AUTH_ERROR_MAP[null as unknown as string]).toBeUndefined();
  });
});
