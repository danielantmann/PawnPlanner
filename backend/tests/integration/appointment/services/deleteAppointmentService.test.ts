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

async function createAppointment(token: string, petId: number, serviceId: number) {
  const start = new Date(Date.now() + 3600000).toISOString();
  const end = new Date(Date.now() + 7200000).toISOString();

  const res = await apiRequest
    .post('/appointments')
    .set('Authorization', `Bearer ${token}`)
    .send({ petId, serviceId, startTime: start, endTime: end });

  return Number(res.body.id);
}

describe('Appointment - deleteAppointment (integration)', () => {
  it('should delete an appointment successfully', async () => {
    const token = await createUser();
    const ownerId = await createOwner(token);
    const animalId = await createAnimal(token);
    const petId = await createPet(token, ownerId, animalId);
    const serviceId = await createService(token);
    const appointmentId = await createAppointment(token, petId, serviceId);

    const res = await apiRequest
      .delete(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 if appointment does not exist', async () => {
    const token = await createUser();

    const res = await apiRequest
      .delete('/appointments/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
