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

describe('Service - deleteService (integration)', () => {
  it('should delete a service', async () => {
    const token = await createUser();
    const id = await createService(token);

    const res = await apiRequest.delete(`/services/${id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 if service does not exist', async () => {
    const token = await createUser();

    const res = await apiRequest.delete('/services/9999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
