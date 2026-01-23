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

async function createService(token: string) {
  const res = await request(app)
    .post('/services')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Corte', price: 20 });

  return res.body.id;
}

describe('Service - deleteService (integration)', () => {
  it('should delete a service', async () => {
    const token = await createUser();
    const id = await createService(token);

    const res = await request(app)
      .delete(`/services/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 if service does not exist', async () => {
    const token = await createUser();

    const res = await request(app).delete('/services/9999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
