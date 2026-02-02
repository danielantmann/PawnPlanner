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

async function createAnimal(token: string) {
  const res = await apiRequest
    .post('/animals')
    .set('Authorization', `Bearer ${token}`)
    .send({ species: 'Dog' });

  return res.body.id;
}

async function createBreed(token: string, animalId: number, name: string) {
  const res = await apiRequest
    .post('/breeds')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, animalId });

  return res.body.id;
}

describe('Breed - UpdateBreed (integration)', () => {
  it('should update a breed successfully', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const breedId = await createBreed(token, animalId, 'Labrador');

    const res = await apiRequest
      .put(`/breeds/${breedId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: breedId, name: 'Beagle' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Beagle');
  });

  it('should return 400 for invalid name', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const breedId = await createBreed(token, animalId, 'Labrador');

    const res = await apiRequest
      .put(`/breeds/${breedId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: breedId, name: 'a' });

    expect(res.status).toBe(400);
  });

  it('should return 404 if breed does not exist', async () => {
    const token = await createUser();

    const res = await apiRequest
      .put('/breeds/9999')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 9999, name: 'Beagle' });

    expect(res.status).toBe(404);
  });
});
