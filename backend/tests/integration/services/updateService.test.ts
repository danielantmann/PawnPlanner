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

async function createService(token: string) {
  const res = await apiRequest
    .post('/services')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Corte', price: 20 });

  return res.body.id;
}

describe('Service - updateService (integration)', () => {
  it('should update a service', async () => {
    const token = await createUser();
    const id = await createService(token);

    const res = await apiRequest
      .put(`/services/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Corte Premium', price: 25 });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Corte Premium');
    expect(res.body.price).toBe(25);
  });

  it('should return 400 for invalid name', async () => {
    const token = await createUser();
    const id = await createService(token);

    const res = await apiRequest
      .put(`/services/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '   ' });

    expect(res.status).toBe(400);
  });

  it('should return 404 if service does not exist', async () => {
    const token = await createUser();

    const res = await apiRequest
      .put('/services/9999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'X' });

    expect(res.status).toBe(404);
  });
});
