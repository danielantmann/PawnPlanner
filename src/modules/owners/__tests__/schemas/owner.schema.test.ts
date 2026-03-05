import { getOwnerSchema } from '../../schemas/owner.schema';

jest.mock('@/src/i18n', () => ({
  t: (key: string) => key,
  default: { t: (key: string) => key },
}));

describe('owner.schema', () => {
  const schema = getOwnerSchema();

  describe('name', () => {
    it('rejects empty name', () => {
      const result = schema.safeParse({ name: '', phone: '612345678' });
      expect(result.success).toBe(false);
    });

    it('rejects name shorter than 2 chars', () => {
      const result = schema.safeParse({ name: 'A', phone: '612345678' });
      expect(result.success).toBe(false);
    });

    it('rejects name longer than 50 chars', () => {
      const result = schema.safeParse({ name: 'A'.repeat(51), phone: '612345678' });
      expect(result.success).toBe(false);
    });

    it('accepts valid name', () => {
      const result = schema.safeParse({ name: 'Juan García', phone: '612345678' });
      expect(result.success).toBe(true);
    });
  });

  describe('email', () => {
    it('accepts missing email', () => {
      const result = schema.safeParse({ name: 'Juan', phone: '612345678' });
      expect(result.success).toBe(true);
    });

    it('accepts empty email', () => {
      const result = schema.safeParse({ name: 'Juan', email: '', phone: '612345678' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = schema.safeParse({ name: 'Juan', email: 'notanemail', phone: '612345678' });
      expect(result.success).toBe(false);
    });

    it('accepts valid email', () => {
      const result = schema.safeParse({ name: 'Juan', email: 'juan@test.com', phone: '612345678' });
      expect(result.success).toBe(true);
    });
  });

  describe('phone', () => {
    it('rejects empty phone', () => {
      const result = schema.safeParse({ name: 'Juan', phone: '' });
      expect(result.success).toBe(false);
    });

    it('rejects phone with letters', () => {
      const result = schema.safeParse({ name: 'Juan', phone: 'abcdefgh' });
      expect(result.success).toBe(false);
    });

    it('accepts valid phone', () => {
      const result = schema.safeParse({ name: 'Juan', phone: '612345678' });
      expect(result.success).toBe(true);
    });

    it('accepts phone with country code', () => {
      const result = schema.safeParse({ name: 'Juan', phone: '+34612345678' });
      expect(result.success).toBe(true);
    });
  });
});
