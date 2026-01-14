import request from 'supertest';
import app from '../../../api/app';
import { describe, expect, it } from 'vitest';
import '../../setup/test-setup';

describe('POST /auth/register', () => {
  it('should register a new user', async () => {
    const email = `new-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password: 'Password123!', firstName: 'John', lastName: 'Doe' });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it('should return 409 if email already exists', async () => {
    const email = `exists-${Date.now()}@example.com`;
    await request(app)
      .post('/auth/register')
      .send({ email, password: 'Password123!', firstName: 'Jane', lastName: 'Smith' });
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password: 'Password123!', firstName: 'Jane', lastName: 'Smith' });
    expect(res.status).toBe(409);
  });

  it('should return 400 if email is invalid', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'invalid-email',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(res.status).toBe(400);
  });

  it('should accept password exactly at min length (6)', async () => {
    const email = `minpass-${Date.now()}@example.com`;
    // 6 caracteres: mayúscula P, número 1, especial !
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password: 'P1$abc', firstName: 'John', lastName: 'Doe' });
    expect(res.status).toBe(201);
  });

  it('should accept password exactly at max length (12)', async () => {
    const email = `maxpass-${Date.now()}@example.com`;
    // 12 caracteres: mayúscula P, número 9, especial !
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password: 'Passw0rd!ABC', firstName: 'John', lastName: 'Doe' });
    expect(res.status).toBe(201);
  });

  it('should normalize email with spaces and uppercase', async () => {
    const email = `normalize-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: ` ${email.toUpperCase()} `,
        password: 'Password123!',
        firstName: 'Norm',
        lastName: 'User',
      });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(email); // normalized
  });
});
