import { describe, it, expect } from 'vitest';
import '../../../setup/test-setup';
import { apiRequest } from '../../../setup/apiRequest';

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

describe('Animal - GetAnimalsBySpecies (integration)', () => {
  it('should return animals by species', async () => {
    const token = await createUser();

    await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const res = await apiRequest
      .get('/animals/species/dog')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].species).toBe('Dog');
  });

  it('should return empty array if no animals match species', async () => {
    const token = await createUser();

    const res = await apiRequest
      .get('/animals/species/cat')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
