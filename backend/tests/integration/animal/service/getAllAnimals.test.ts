import { describe, it, expect } from 'vitest';
import { apiRequest } from '../../../setup/apiRequest';
import '../../../setup/test-setup';

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

describe('Animal - GetAllAnimals (integration)', () => {
  it('should return empty array when no animals exist', async () => {
    const token = await createUser();

    const res = await apiRequest.get('/animals').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all animals for the user', async () => {
    const token = await createUser();

    await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Cat' });

    const res = await apiRequest.get('/animals').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.map((a: any) => a.species)).toEqual(expect.arrayContaining(['Dog', 'Cat']));
  });
});
