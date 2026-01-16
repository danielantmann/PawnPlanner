import request from 'supertest';
import app from '../../../../api/app';
import '../../../setup/test-setup';
import { describe, it, expect } from 'vitest';

async function createTestUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const registerRes = await request(app).post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return registerRes.body.accessToken;
}

describe('Owner integration - error cases & normalization', () => {
  it('should return 404 when owner not found by id', async () => {
    const token = await createTestUser();

    const res = await request(app).get('/owners/999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Owner not found');
  });

  it('should return 409 when creating owner with duplicate email', async () => {
    const token = await createTestUser();

    // primer insert
    await request(app).post('/owners').set('Authorization', `Bearer ${token}`).send({
      name: 'Daniel',
      email: 'dan@test.com',
      phone: '1234567',
    });

    // segundo insert con mismo email
    const res = await request(app).post('/owners').set('Authorization', `Bearer ${token}`).send({
      name: 'Other',
      email: 'dan@test.com',
      phone: '7654321',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/Owner with email .* already exists/);
  });

  it('should return 400 when DTO is invalid', async () => {
    const token = await createTestUser();

    const res = await request(app).post('/owners').set('Authorization', `Bearer ${token}`).send({
      name: '', // inválido
      email: 'not-an-email',
      phone: '12',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'email', constraints: expect.any(Object) }),
        expect.objectContaining({ property: 'phone', constraints: expect.any(Object) }),
        expect.objectContaining({ property: 'name', constraints: expect.any(Object) }),
      ])
    );
  });

  it('should normalize owner name on creation', async () => {
    const token = await createTestUser();

    const res = await request(app).post('/owners').set('Authorization', `Bearer ${token}`).send({
      name: 'juan jose lopez',
      email: 'juan@test.com',
      phone: '1234567',
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Juan Jose Lopez'); // 👈 comprobamos titleCase
  });
});
