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
      email: `dan-${Date.now()}@test.com`,
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

describe('Pet - CreatePet (integration)', () => {
  it('should create a pet using ownerId + breedId', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);

    const res = await request(app).post('/pets').set('Authorization', `Bearer ${token}`).send({
      name: 'Bobby',
      ownerId,
      breedId,
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Bobby');
    expect(res.body.ownerId).toBe(ownerId);
    expect(res.body.breed).toBe('Labrador');
  });

  it('should create a pet using ownerData + breedData', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    const res = await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rocky',
        ownerData: {
          name: 'Daniel',
          email: `dan-${Date.now()}@test.com`,
          phone: '12345',
        },
        breedData: {
          name: 'Beagle',
          animalId,
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Rocky');
    expect(res.body.ownerName).toBe('Daniel');
    expect(res.body.breed).toBe('Beagle');
  });

  it('should return 404 if ownerId does not exist', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const breedId = await createBreed(token, animalId);

    const res = await request(app).post('/pets').set('Authorization', `Bearer ${token}`).send({
      name: 'Ghost',
      ownerId: 9999,
      breedId,
    });

    expect(res.status).toBe(404);
  });

  it('should return 404 if breedId does not exist', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);

    const res = await request(app).post('/pets').set('Authorization', `Bearer ${token}`).send({
      name: 'Ghost',
      ownerId,
      breedId: 9999,
    });

    expect(res.status).toBe(404);
  });

  it('should return 404 if breedData.animalId does not exist', async () => {
    const token = await createUser();

    const res = await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Ghost',
        ownerData: {
          name: 'Daniel',
          email: `dan-${Date.now()}@test.com`,
          phone: '12345',
        },
        breedData: {
          name: 'Labrador',
          animalId: 9999,
        },
      });

    expect(res.status).toBe(404);
  });

  it('should return 400 if no owner info is provided', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const breedId = await createBreed(token, animalId);

    const res = await request(app).post('/pets').set('Authorization', `Bearer ${token}`).send({
      name: 'Ghost',
      breedId,
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 if no breed info is provided', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);

    const res = await request(app).post('/pets').set('Authorization', `Bearer ${token}`).send({
      name: 'Ghost',
      ownerId,
    });

    expect(res.status).toBe(400);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post('/pets').send({ name: 'Ghost' });
    expect(res.status).toBe(401);
  });

  it('should return 400 if ownerData.phone is invalid (and not return 500)', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    const res = await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rocky',
        ownerData: {
          name: 'Daniel',
          email: `dan-${Date.now()}@test.com`,
          phone: '12', // ❌ inválido (muy corto)
        },
        breedData: {
          name: 'Beagle',
          animalId,
        },
      });

    console.log(JSON.stringify(res.body.errors, null, 2));

    // Validación correcta
    expect(res.status).toBe(400);

    // Debe contener errores de validación
    expect(Array.isArray(res.body.errors)).toBe(true);

    // Debe señalar el campo correcto
    expect(res.body.errors.some((e: any) => e.field === 'ownerData.phone')).toBe(true);
  });
});
