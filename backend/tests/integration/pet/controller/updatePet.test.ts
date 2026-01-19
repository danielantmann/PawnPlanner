import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createUser() {
  const email = `user-${Date.now()}-update@test.com`;
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
      email: `dan-${Date.now()}-update@test.com`,
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

describe('Pet - UpdatePet Controller (integration)', () => {
  it('should update pet name successfully', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);
    const petId = await createPet(token, ownerId, breedId);

    const res = await request(app)
      .put(`/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Bobby' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Bobby');
    expect(res.body.id).toBe(petId);
  });

  it('should update pet birthDate successfully', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);
    const petId = await createPet(token, ownerId, breedId);

    const res = await request(app)
      .put(`/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ birthDate: '2020-01-15' });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(petId);
  });

  it('should update pet importantNotes successfully', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);
    const petId = await createPet(token, ownerId, breedId);

    const res = await request(app)
      .put(`/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ importantNotes: 'Allergic to chicken' });

    expect(res.status).toBe(200);
    expect(res.body.importantNotes).toBe('Allergic to chicken');
  });

  it('should update pet quickNotes successfully', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);
    const petId = await createPet(token, ownerId, breedId);

    const res = await request(app)
      .put(`/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quickNotes: 'Loves walks' });

    expect(res.status).toBe(200);
    expect(res.body.quickNotes).toBe('Loves walks');
  });

  it('should return 404 if pet does not exist', async () => {
    const token = await createUser();

    const res = await request(app)
      .put('/pets/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ghost Pet' });

    expect(res.status).toBe(404);
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).put('/pets/1').send({ name: 'Unauthorized Update' });

    expect(res.status).toBe(401);
  });

  it('should update multiple fields at once', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);
    const ownerId = await createOwner(token);
    const breedId = await createBreed(token, animalId);
    const petId = await createPet(token, ownerId, breedId);

    const res = await request(app)
      .put(`/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Max',
        birthDate: '2021-05-20',
        importantNotes: 'Allergic to dairy',
        quickNotes: 'Very active',
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Max');
    expect(res.body.importantNotes).toBe('Allergic to dairy');
    expect(res.body.quickNotes).toBe('Very active');
  });
});
