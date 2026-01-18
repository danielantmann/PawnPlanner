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

async function createOwner(token: string) {
  const res = await request(app)
    .post('/owners')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Daniel',
      email: `dan-${Date.now()}@test.com`,
      phone: '1234567',
    });

  return res.body.id;
}

async function createBreed(token: string, animalId: number) {
  const res = await request(app)
    .post('/breeds')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Labrador', animalId });

  return res.body.id;
}

async function createPet(token: string, ownerId: number, breedId: number, name: string) {
  return request(app)
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, ownerId, breedId });
}

describe('Pet - GetAllPets (integration)', () => {
  it('should return empty array when no pets exist', async () => {
    const token = await createUser();

    const res = await request(app).get('/pets').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all pets for the user', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);

    await createPet(token, ownerId, breedId, 'Bobby');
    await createPet(token, ownerId, breedId, 'Rocky');

    const res = await request(app).get('/pets').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.map((p: any) => p.name)).toEqual(expect.arrayContaining(['Bobby', 'Rocky']));
  });
});
