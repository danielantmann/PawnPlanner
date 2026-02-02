import { describe, it, expect } from 'vitest';
import '../../setup/test-setup';
import { apiRequest } from '../../setup/apiRequest';

async function createUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const res = await apiRequest.post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return res.body.accessToken;
}

describe('Service - createService (integration)', () => {
  it('should create a service successfully', async () => {
    const token = await createUser();

    const res = await apiRequest
      .post('/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Corte', price: 20 });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Corte');
    expect(res.body.price).toBe(20);
  });

  it('should return 400 for invalid name', async () => {
    const token = await createUser();

    const res = await apiRequest
      .post('/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '   ', price: 20 });

    expect(res.status).toBe(400);
  });

  it('should return 400 for negative price', async () => {
    const token = await createUser();

    const res = await apiRequest
      .post('/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Corte', price: -5 });

    expect(res.status).toBe(400);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await apiRequest.post('/services').send({ name: 'Corte', price: 20 });

    expect(res.status).toBe(401);
  });
});
