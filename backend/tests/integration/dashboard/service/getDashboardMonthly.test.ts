import { describe, it, expect } from 'vitest';
import '../../../setup/test-setup';
import { apiRequest } from '../../../setup/apiRequest';

async function createUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const res = await apiRequest.post('/auth/register').send({
    email,
    password,
    firstName: 'Dash',
    lastName: 'User',
  });

  return res.body.accessToken;
}

async function createOwner(token: string) {
  const res = await apiRequest
    .post('/owners')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Owner Test',
      phone: '+123456789',
      email: `owner-${Date.now()}@test.com`,
    });

  return res.body.id;
}

async function createAnimal(token: string) {
  const res = await apiRequest
    .post('/animals')
    .set('Authorization', `Bearer ${token}`)
    .send({ species: 'Dog' });

  return res.body.id;
}

async function createPet(token: string, ownerId: number, animalId: number) {
  const res = await apiRequest
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `Pet-${Date.now()}`,
      birthDate: '2020-01-01',
      ownerId,
      breedData: { name: 'Labrador', animalId },
    });

  return res.body.id;
}

async function createService(token: string, name = 'Corte', price = 20) {
  const res = await apiRequest
    .post('/services')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, price });

  return res.body.id;
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

  return res.body.id;
}

describe('Dashboard - Monthly', () => {
  it('should return monthly stats', async () => {
    const token = await createUser();
    const owner = await createOwner(token);
    const animal = await createAnimal(token);
    const pet = await createPet(token, owner, animal);
    const service = await createService(token, 'Corte', 20);

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 5, 10).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth(), 5, 11).toISOString();

    await createAppointment(token, pet, service, start, end);

    const res = await apiRequest.get('/dashboards/monthly').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.appointments).toBe(1);
    expect(res.body.income).toBe(20);
  });

  it('should return zero stats when no monthly appointments', async () => {
    const token = await createUser();

    const res = await apiRequest.get('/dashboards/monthly').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.appointments).toBe(0);
    expect(res.body.income).toBe(0);
  });
});
