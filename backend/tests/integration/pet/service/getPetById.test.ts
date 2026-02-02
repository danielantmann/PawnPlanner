import { describe, it, expect } from 'vitest';
import '../../../setup/test-setup';
import { apiRequest } from '../../../setup/apiRequest';

import { TestDataSource } from '../../../../infrastructure/orm/data-source.helper';
import { PetEntity } from '../../../../infrastructure/orm/entities/PetEntity';

async function createUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  await apiRequest.post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  const login = await apiRequest.post('/auth/login').send({
    email,
    password,
  });

  return login.body.accessToken;
}

async function createAnimal(token: string) {
  const res = await apiRequest
    .post('/animals')
    .set('Authorization', `Bearer ${token}`)
    .send({ species: 'Dog' });

  return res.body.id;
}

async function createOwner(token: string) {
  const res = await apiRequest
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
  const res = await apiRequest
    .post('/breeds')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Labrador', animalId });

  return res.body.id;
}

async function createPet(token: string, ownerId: number, breedId: number) {
  const res = await apiRequest
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Bobby', ownerId, breedId });

  return res.body.id;
}

describe('Pet - GetPetById (integration)', () => {
  it('should return a pet by id', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);

    // 🐛 DEBUG REAL (lo dejo comentado por si lo necesitas)
    // console.log(
    //   '🐛 columnas pets:',
    //   TestDataSource.getRepository(PetEntity).metadata.columns.map((c) => c.propertyName)
    // );

    const petId = await createPet(token, ownerId, breedId);

    const res = await apiRequest.get(`/pets/${petId}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(petId);
    expect(res.body.name).toBe('Bobby');
  });

  it('should return 404 if pet does not exist', async () => {
    const token = await createUser();

    const res = await apiRequest.get('/pets/9999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await apiRequest.get('/pets/1');
    expect(res.status).toBe(401);
  });
});
