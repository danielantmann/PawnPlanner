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

describe('Dashboard - Compare Periods (full validation)', () => {
  it('should return 200 on valid comparison', async () => {
    const token = await createUser();
    const owner = await createOwner(token);
    const animal = await createAnimal(token);
    const pet = await createPet(token, owner, animal);
    const service = await createService(token, 'Corte', 20);

    const now = new Date();

    // Period A → ayer
    const aStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10).toISOString();
    const aEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 11).toISOString();

    // Period B → hoy
    const bStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10).toISOString();
    const bEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11).toISOString();

    await createAppointment(token, pet, service, aStart, aEnd);
    await createAppointment(token, pet, service, bStart, bEnd);

    const res = await apiRequest
      .get('/dashboards/compare')
      .set('Authorization', `Bearer ${token}`)
      .query({
        fromStart: aStart,
        fromEnd: aEnd,
        toStart: bStart,
        toEnd: bEnd,
      });

    expect(res.status).toBe(200);
    expect(res.body.from.appointments).toBe(1);
    expect(res.body.to.appointments).toBe(1);
  });

  it('should fail: invalid from.start', async () => {
    const token = await createUser();

    const res = await apiRequest
      .get('/dashboards/compare')
      .set('Authorization', `Bearer ${token}`)
      .query({
        fromStart: 'invalid',
        fromEnd: new Date().toISOString(),
        toStart: new Date().toISOString(),
        toEnd: new Date(Date.now() + 1000).toISOString(),
      });

    expect(res.status).toBe(400);
  });

  it('should fail: invalid from.end', async () => {
    const token = await createUser();

    const res = await apiRequest
      .get('/dashboards/compare')
      .set('Authorization', `Bearer ${token}`)
      .query({
        fromStart: new Date().toISOString(),
        fromEnd: 'invalid',
        toStart: new Date().toISOString(),
        toEnd: new Date(Date.now() + 1000).toISOString(),
      });

    expect(res.status).toBe(400);
  });

  it('should fail: invalid to.start', async () => {
    const token = await createUser();

    const res = await apiRequest
      .get('/dashboards/compare')
      .set('Authorization', `Bearer ${token}`)
      .query({
        fromStart: new Date().toISOString(),
        fromEnd: new Date(Date.now() + 1000).toISOString(),
        toStart: 'invalid',
        toEnd: new Date(Date.now() + 2000).toISOString(),
      });

    expect(res.status).toBe(400);
  });

  it('should fail: invalid to.end', async () => {
    const token = await createUser();

    const res = await apiRequest
      .get('/dashboards/compare')
      .set('Authorization', `Bearer ${token}`)
      .query({
        fromStart: new Date().toISOString(),
        fromEnd: new Date(Date.now() + 1000).toISOString(),
        toStart: new Date().toISOString(),
        toEnd: 'invalid',
      });

    expect(res.status).toBe(400);
  });

  it('should fail: invalid "from" range (start >= end)', async () => {
    const token = await createUser();

    const now = new Date().toISOString();

    const res = await apiRequest
      .get('/dashboards/compare')
      .set('Authorization', `Bearer ${token}`)
      .query({
        fromStart: now,
        fromEnd: now, // same → invalid
        toStart: new Date().toISOString(),
        toEnd: new Date(Date.now() + 1000).toISOString(),
      });

    expect(res.status).toBe(400);
  });

  it('should fail: invalid "to" range (start >= end)', async () => {
    const token = await createUser();

    const now = new Date().toISOString();

    const res = await apiRequest
      .get('/dashboards/compare')
      .set('Authorization', `Bearer ${token}`)
      .query({
        fromStart: new Date().toISOString(),
        fromEnd: new Date(Date.now() + 1000).toISOString(),
        toStart: now,
        toEnd: now, // same → invalid
      });

    expect(res.status).toBe(400);
  });
});
