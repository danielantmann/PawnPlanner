import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createUser() {
  const email = `user-${Date.now()}-delete@test.com`;
  const password = 'Password123!';

  const res = await request(app).post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return res.body.accessToken;
}

async function createAnimal(token: string, species = 'Dog') {
  const res = await request(app)
    .post('/animals')
    .set('Authorization', `Bearer ${token}`)
    .send({ species });

  return res.body.id;
}

async function createOwner(token: string) {
  const res = await request(app)
    .post('/owners')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Daniel',
      email: `dan-${Date.now()}-delete@test.com`,
      phone: '1234567',
    });

  return res.body.id;
}

async function createBreed(token: string, animalId: number, name = 'Labrador') {
  const res = await request(app)
    .post('/breeds')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, animalId });

  return res.body.id;
}

async function createPet(token: string, ownerId: number, breedId: number, name = 'Bobby') {
  const res = await request(app).post('/pets').set('Authorization', `Bearer ${token}`).send({
    name,
    ownerId,
    breedId,
  });

  return res.body.id;
}

describe('Pet - DeletePet Controller (integration)', () => {
  it('should delete pet successfully', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);
    const petId = await createPet(token, ownerId, breedId);

    const res = await request(app).delete(`/pets/${petId}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 if pet does not exist', async () => {
    const token = await createUser();

    const res = await request(app).delete('/pets/99999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).delete('/pets/1');

    expect(res.status).toBe(401);
  });

  it('should not be able to delete same pet twice', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);
    const petId = await createPet(token, ownerId, breedId);

    // Delete pet first time
    const res1 = await request(app)
      .delete(`/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res1.status).toBe(204);

    // Try to delete same pet again
    const res2 = await request(app)
      .delete(`/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res2.status).toBe(404);
  });

  it('should allow multiple pets to be deleted', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);

    const petId1 = await createPet(token, ownerId, breedId, 'Pet1');
    const petId2 = await createPet(token, ownerId, breedId, 'Pet2');

    const res1 = await request(app)
      .delete(`/pets/${petId1}`)
      .set('Authorization', `Bearer ${token}`);

    const res2 = await request(app)
      .delete(`/pets/${petId2}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res1.status).toBe(204);
    expect(res2.status).toBe(204);
  });
});
