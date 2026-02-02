import { describe, it, expect } from 'vitest';
import '../../../setup/test-setup';
import { apiRequest } from '../../../setup/apiRequest';

async function createTestUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const registerRes = await apiRequest.post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return registerRes.body.accessToken;
}

describe('Owner service - createOwner', () => {
  it('should create a new owner successfully', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Daniel');
    expect(res.body.phone).toBe('1234567');
    expect(res.body.email).toBe('dan@google.com');
    expect(Array.isArray(res.body.pets)).toBe(true);
    expect(res.body.pets.length).toBe(0);
  });

  it('should throw ConflictError if email already exists', async () => {
    const token = await createTestUser();

    await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Laura', phone: '5555555', email: 'laura@test.com' });

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Laura2', phone: '6666666', email: 'laura@test.com' });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('email');
  });

  it('should throw ConflictError if phone already exists', async () => {
    const token = await createTestUser();

    await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mario', phone: '7777777', email: 'mario@test.com' });

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mario2', phone: '7777777', email: 'mario2@test.com' });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('phone');
  });

  it('should return DTO with correct types', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ana', phone: '8888888', email: 'ana@test.com' });

    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe('number');
    expect(typeof res.body.name).toBe('string');
    expect(typeof res.body.phone).toBe('string');
    expect(typeof res.body.email).toBe('string');
    expect(Array.isArray(res.body.pets)).toBe(true);
  });

  it('should return 400 if name is empty', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', phone: '1234567', email: 'emptyname@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'name')).toBe(true);
  });

  it('should return 400 if phone is too short', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '123', email: 'shortphone@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'phone')).toBe(true);
  });

  it('should return 400 if email is invalid', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'email')).toBe(true);
  });

  it('should return 400 if name is too short', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'A', phone: '1234567', email: 'shortname@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'name')).toBe(true);
  });

  it('should return 400 if phone is missing', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', email: 'missingphone@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'phone')).toBe(true);
  });

  it('should return 400 if email is missing', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'email')).toBe(true);
  });

  it('should include constraints in validation error for invalid email', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'not-an-email' });

    expect(res.status).toBe(400);
    const emailError = res.body.errors.find((e: any) => e.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError.constraints).toHaveProperty('isEmail');
  });

  it('should detect duplicate email regardless of case', async () => {
    const token = await createTestUser();

    await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const res = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '7654321', email: 'DAN@GOOGLE.COM' });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('email');
  });
});
