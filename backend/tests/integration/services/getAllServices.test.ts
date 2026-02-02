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

async function createService(token: string, name: string, price: number) {
  return apiRequest.post('/services').set('Authorization', `Bearer ${token}`).send({ name, price });
}

describe('Service - getAllServices (integration)', () => {
  it('should return empty array when no services exist', async () => {
    const token = await createUser();

    const res = await apiRequest.get('/services').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all services for the user', async () => {
    const token = await createUser();

    await createService(token, 'Corte', 20);
    await createService(token, 'Baño', 15);

    const res = await apiRequest.get('/services').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.map((s: any) => s.name)).toEqual(expect.arrayContaining(['Corte', 'Baño']));
  });
});
