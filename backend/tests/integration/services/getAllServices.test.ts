import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../api/app';
import '../../setup/test-setup';

async function createUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const res = await request(app).post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return res.body.accessToken;
}

async function createService(token: string, name: string, price: number) {
  return request(app)
    .post('/services')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, price });
}

describe('Service - getAllServices (integration)', () => {
  it('should return empty array when no services exist', async () => {
    const token = await createUser();

    const res = await request(app).get('/services').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all services for the user', async () => {
    const token = await createUser();

    await createService(token, 'Corte', 20);
    await createService(token, 'Baño', 15);

    const res = await request(app).get('/services').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.map((s: any) => s.name)).toEqual(expect.arrayContaining(['Corte', 'Baño']));
  });
});
