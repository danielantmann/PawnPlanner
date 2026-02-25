import { createAuthSchema } from '../../schemas/authSchema';
import type { TFunction } from 'i18next';

describe('authSchema', () => {
  // Mock de i18n compatible con TFunction
  const t = ((key: string) => key) as unknown as TFunction;

  const loginSchema = createAuthSchema(t, true);
  const registerSchema = createAuthSchema(t, false);

  // -----------------------------
  // LOGIN SCHEMA
  // -----------------------------
  describe('loginSchema', () => {
    it('fails when email is invalid', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'Abc123!',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('auth.errors.emailInvalid');
    });

    it('fails when password is invalid', () => {
      const result = loginSchema.safeParse({
        email: 'test@test.com',
        password: 'abc',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('auth.errors.passwordInvalid');
    });

    it('passes with valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@test.com',
        password: 'Abc123!',
      });

      expect(result.success).toBe(true);
    });
  });

  // -----------------------------
  // REGISTER SCHEMA
  // -----------------------------
  describe('registerSchema', () => {
    it('fails when firstName is empty', () => {
      const result = registerSchema.safeParse({
        firstName: '',
        lastName: 'User',
        email: 'test@test.com',
        password: 'Abc123!',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('auth.errors.firstNameRequired');
    });

    it('fails when lastName is empty', () => {
      const result = registerSchema.safeParse({
        firstName: 'John',
        lastName: '',
        email: 'test@test.com',
        password: 'Abc123!',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('auth.errors.lastNameRequired');
    });

    it('fails when email is invalid', () => {
      const result = registerSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'bademail',
        password: 'Abc123!',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('auth.errors.emailInvalid');
    });

    it('fails when password is invalid', () => {
      const result = registerSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        password: 'abc',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('auth.errors.passwordInvalid');
    });

    it('passes with valid register data', () => {
      const result = registerSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        password: 'Abc123!',
      });

      expect(result.success).toBe(true);
    });
  });
});
