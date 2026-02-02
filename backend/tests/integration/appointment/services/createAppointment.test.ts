import { describe, it, expect } from 'vitest';
import '../../../setup/test-setup';
import { apiRequest } from '../../../setup/apiRequest';

// -------------------------
// HELPERS
// -------------------------

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

async function createOwner(token: string) {
  const res = await apiRequest
    .post('/owners')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'John Doe',
      phone: '+1234567890',
      email: `owner-${Date.now()}@test.com`,
    });

  return Number(res.body.id);
}

async function createAnimal(token: string) {
  const res = await apiRequest
    .post('/animals')
    .set('Authorization', `Bearer ${token}`)
    .send({ species: 'Dog' });

  return Number(res.body.id);
}

async function createPet(token: string, ownerId: number, animalId: number) {
  const res = await apiRequest
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Firulais',
      birthDate: '2020-01-01',
      ownerId: Number(ownerId),
      breedData: {
        name: 'Labrador',
        animalId: Number(animalId),
      },
    });

  return Number(res.body.id);
}

async function createService(token: string) {
  const res = await apiRequest
    .post('/services')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Corte', price: 20 });

  return Number(res.body.id);
}

// -------------------------
// TESTS
// -------------------------

describe('Appointment - createAppointment (integration)', () => {
  it('should create an appointment successfully', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);
    const animalId = await createAnimal(token);
    const petId = await createPet(token, ownerId, animalId);
    const serviceId = await createService(token);

    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();

    const res = await apiRequest
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId: Number(petId),
        serviceId: Number(serviceId),
        startTime: start,
        endTime: end,
      });

    expect(res.status).toBe(201);
    expect(res.body.petId).toBe(petId);
    expect(res.body.serviceId).toBe(serviceId);
    expect(res.body.status).toBe('completed');
  });

  it('should return 404 if pet does not exist', async () => {
    const token = await createUser();
    const serviceId = await createService(token);

    const start = new Date().toISOString();
    const end = new Date(Date.now() + 3600000).toISOString();

    const res = await apiRequest
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId: 9999,
        serviceId,
        startTime: start,
        endTime: end,
      });

    expect(res.status).toBe(404);
  });

  it('should return 404 if service does not exist', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);
    const animalId = await createAnimal(token);
    const petId = await createPet(token, ownerId, animalId);

    const start = new Date().toISOString();
    const end = new Date(Date.now() + 3600000).toISOString();

    const res = await apiRequest
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId,
        serviceId: 9999,
        startTime: start,
        endTime: end,
      });

    expect(res.status).toBe(404);
  });

  it('should return 400 for invalid date format', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);
    const animalId = await createAnimal(token);
    const petId = await createPet(token, ownerId, animalId);
    const serviceId = await createService(token);

    const res = await apiRequest
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId,
        serviceId,
        startTime: 'invalid',
        endTime: 'invalid',
      });

    expect(res.status).toBe(400);
  });

  it('should return 400 if startTime >= endTime', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);
    const animalId = await createAnimal(token);
    const petId = await createPet(token, ownerId, animalId);
    const serviceId = await createService(token);

    const now = new Date().toISOString();

    const res = await apiRequest
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId,
        serviceId,
        startTime: now,
        endTime: now,
      });

    expect(res.status).toBe(400);
  });

  it('should return 409 if appointment overlaps with an existing one', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);
    const animalId = await createAnimal(token);
    const petId = await createPet(token, ownerId, animalId);
    const serviceId = await createService(token);

    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();

    await apiRequest
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ petId, serviceId, startTime: start, endTime: end });

    const res = await apiRequest
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId,
        serviceId,
        startTime: start,
        endTime: end,
      });

    expect(res.status).toBe(409);
  });

  it('should return 400 if finalPrice is negative', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);
    const animalId = await createAnimal(token);
    const petId = await createPet(token, ownerId, animalId);
    const serviceId = await createService(token);

    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();

    const res = await apiRequest
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId,
        serviceId,
        startTime: start,
        endTime: end,
        finalPrice: -10,
      });

    expect(res.status).toBe(400);
  });
});
