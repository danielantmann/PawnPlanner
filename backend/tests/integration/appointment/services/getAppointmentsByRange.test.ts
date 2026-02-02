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
      ownerId,
      breedData: {
        name: 'Labrador',
        animalId,
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

async function createAppointment(
  token: string,
  petId: number,
  serviceId: number,
  start: string,
  end: string
) {
  const res = await apiRequest
    .post('/appointments')
    .set('Authorization', `Bearer ${token}`)
    .send({ petId, serviceId, startTime: start, endTime: end });

  return Number(res.body.id);
}

describe('Appointment - getAppointmentsByRange (integration)', () => {
  it('should return appointments in range', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);
    const animalId = await createAnimal(token);
    const petId = await createPet(token, ownerId, animalId);
    const serviceId = await createService(token);

    const start1 = '2026-01-01T10:00:00Z';
    const end1 = '2026-01-01T11:00:00Z';

    const start2 = '2026-01-02T10:00:00Z';
    const end2 = '2026-01-02T11:00:00Z';

    await createAppointment(token, petId, serviceId, start1, end1);
    await createAppointment(token, petId, serviceId, start2, end2);

    const res = await apiRequest
      .get('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2026-01-01T00:00:00Z',
        end: '2026-01-03T00:00:00Z',
      });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should return 400 for invalid dates', async () => {
    const token = await createUser();

    const res = await apiRequest
      .get('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: 'invalid',
        end: 'invalid',
      });

    expect(res.status).toBe(400);
  });
});
