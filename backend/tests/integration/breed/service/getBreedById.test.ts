import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

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

async function createAnimal(token: string) {
  const res = await request(app)
    .post('/animals')
    .set('Authorization', `Bearer ${token}`)
    .send({ species: 'Dog' });

  return res.body.id;
}

async function createBreed(token: string, animalId: number) {
  const res = await request(app)
    .post('/breeds')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Labrador', animalId });

  return res.body.id;
}

describe('Breed - GetBreedById (integration)', () => {
  it('should return a breed by id', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const breedId = await createBreed(token, animalId);

    const res = await request(app)
      .get(`/breeds/${breedId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(breedId);
    expect(res.body.name).toBe('Labrador');
    expect(res.body.animal.id).toBe(animalId);
  });

  it('should return 404 if breed does not exist', async () => {
    const token = await createUser();

    const res = await request(app).get('/breeds/9999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/breeds/1');
    expect(res.status).toBe(401);
  });
});
