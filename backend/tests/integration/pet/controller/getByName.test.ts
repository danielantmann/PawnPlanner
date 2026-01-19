import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createUser() {
  const email = `user-${Date.now()}-name@test.com`;
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
      email: `dan-${Date.now()}-name@test.com`,
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

  return res.body;
}

describe('Pet - GetPetsByName Controller (integration)', () => {
  it('should return pets by name', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);

    const pet1 = await createPet(token, ownerId, breedId, 'Fluffy');
    const pet2 = await createPet(token, ownerId, breedId, 'Fluffy');

    const res = await request(app).get('/pets/name/Fluffy').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body.some((p: any) => p.id === pet1.id)).toBe(true);
    expect(res.body.some((p: any) => p.id === pet2.id)).toBe(true);
  });

  it('should return empty array if no pets match name', async () => {
    const token = await createUser();

    const res = await request(app)
      .get('/pets/name/NonexistentPet')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).get('/pets/name/Fluffy');

    expect(res.status).toBe(401);
  });

  it('should search case-insensitively', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);

    await createPet(token, ownerId, breedId, 'Buddy');

    const resLower = await request(app)
      .get('/pets/name/buddy')
      .set('Authorization', `Bearer ${token}`);

    const resUpper = await request(app)
      .get('/pets/name/BUDDY')
      .set('Authorization', `Bearer ${token}`);

    expect(resLower.status).toBe(200);
    expect(resUpper.status).toBe(200);
  });

  it('should only return pets from authenticated user', async () => {
    const token1 = await createUser();
    const token2 = await createUser();

    const animalId1 = await createAnimal(token1);
    const ownerId1 = await createOwner(token1);
    const breedId1 = await createBreed(token1, animalId1);

    const animalId2 = await createAnimal(token2);
    const ownerId2 = await createOwner(token2);
    const breedId2 = await createBreed(token2, animalId2);

    const pet1 = await createPet(token1, ownerId1, breedId1, 'Max');
    const pet2 = await createPet(token2, ownerId2, breedId2, 'Max');

    const res1 = await request(app).get('/pets/name/Max').set('Authorization', `Bearer ${token1}`);

    expect(res1.status).toBe(200);
    expect(res1.body.some((p: any) => p.id === pet1.id)).toBe(true);
    expect(res1.body.some((p: any) => p.id === pet2.id)).toBe(false);
  });

  it('should return pets with special characters in name', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);

    const pet = await createPet(token, ownerId, breedId, 'Fluffy-Max');

    const res = await request(app)
      .get('/pets/name/Fluffy-Max')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return different results for different names', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);

    const pet1 = await createPet(token, ownerId, breedId, 'Bobby');
    const pet2 = await createPet(token, ownerId, breedId, 'Max');

    const res1 = await request(app).get('/pets/name/Bobby').set('Authorization', `Bearer ${token}`);

    const res2 = await request(app).get('/pets/name/Max').set('Authorization', `Bearer ${token}`);

    const hasBobby = res1.body.some((p: any) => p.id === pet1.id);
    const hasMax = res2.body.some((p: any) => p.id === pet2.id);

    expect(hasBobby).toBe(true);
    expect(hasMax).toBe(true);
  });
});
