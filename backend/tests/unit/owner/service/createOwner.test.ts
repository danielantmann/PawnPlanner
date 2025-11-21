import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

describe('Owner service - createOwner', () => {
  it('should create a new owner successfully', async () => {
    const res = await request(app)
      .post('/owners')
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
    await request(app)
      .post('/owners')
      .send({ name: 'Laura', phone: '5555555', email: 'laura@test.com' });

    const res = await request(app)
      .post('/owners')
      .send({ name: 'Laura2', phone: '6666666', email: 'laura@test.com' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('email');
  });

  it('should throw ConflictError if phone already exists', async () => {
    await request(app)
      .post('/owners')
      .send({ name: 'Mario', phone: '7777777', email: 'mario@test.com' });

    const res = await request(app)
      .post('/owners')
      .send({ name: 'Mario2', phone: '7777777', email: 'mario2@test.com' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('phone');
  });

  it('should return DTO with correct types', async () => {
    const res = await request(app)
      .post('/owners')
      .send({ name: 'Ana', phone: '8888888', email: 'ana@test.com' });

    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe('number');
    expect(typeof res.body.name).toBe('string');
    expect(typeof res.body.phone).toBe('string');
    expect(typeof res.body.email).toBe('string');
    expect(Array.isArray(res.body.pets)).toBe(true);
  });

  it('should return 400 if name is empty', async () => {
    const res = await request(app)
      .post('/owners')
      .send({ name: '', phone: '1234567', email: 'emptyname@test.com' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.some((e: any) => e.property === 'name')).toBe(true);
  });

  it('should return 400 if phone is too short', async () => {
    const res = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '123', email: 'shortphone@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.property === 'phone')).toBe(true);
  });

  it('should return 400 if email is invalid', async () => {
    const res = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '1234567', email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.property === 'email')).toBe(true);
  });

  it('should return 400 if name is too short', async () => {
    const res = await request(app)
      .post('/owners')
      .send({ name: 'A', phone: '1234567', email: 'shortname@test.com' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.some((e: any) => e.property === 'name')).toBe(true);
  });

  it('should return 400 if phone is missing', async () => {
    const res = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', email: 'missingphone@test.com' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.some((e: any) => e.property === 'phone')).toBe(true);
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/owners').send({ name: 'Daniel', phone: '1234567' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.some((e: any) => e.property === 'email')).toBe(true);
  });

  it('should include constraints in validation error for invalid email', async () => {
    const res = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '1234567', email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    const emailError = res.body.errors.find((e: any) => e.property === 'email');
    expect(emailError).toBeDefined();
    expect(emailError.constraints).toHaveProperty('isEmail');
    expect(emailError.constraints.isEmail).toContain('Email must be a valid email address');
  });

  it('should detect duplicate email regardless of case', async () => {
    await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const res = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '7654321', email: 'DAN@GOOGLE.COM' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('email');
  });
});
