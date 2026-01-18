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

async function createBreed(token: string, animalId: number, name: string) {
  return request(app)
    .post('/breeds')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, animalId });
}

describe('Breed - GetBreedsByAnimal (integration)', () => {
  it('should return breeds for a specific animal', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    await createBreed(token, animalId, 'Labrador');

    const res = await request(app)
      .get(`/breeds/animal/${animalId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Labrador');
  });

  it('should return empty array if no breeds exist for the animal', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    const res = await request(app)
      .get(`/breeds/animal/${animalId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
