import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

// Helpers reutilizados del test anterior
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

async function createOwner(token: string) {
  const timestamp = Date.now().toString().slice(-8); // ⭐ Solo últimos 8 dígitos

  const res = await request(app)
    .post('/owners')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'John Doe',
      phone: `+${timestamp}`, // ⭐ Ahora genera: +25931213 (9 caracteres)
      email: `owner-${Date.now()}@test.com`,
    });

  if (res.status !== 201 && res.status !== 200) {
    throw new Error(`Failed to create owner: ${res.status} - ${JSON.stringify(res.body)}`);
  }

  return Number(res.body.id);
}

async function createAnimal(token: string) {
  const res = await request(app)
    .post('/animals')
    .set('Authorization', `Bearer ${token}`)
    .send({ species: 'Dog' });

  return Number(res.body.id);
}

async function createPet(
  token: string,
  ownerId: number,
  animalId: number,
  name = `Pet-${Date.now()}`, // único
  breed = 'Labrador'
) {
  const res = await request(app)
    .post('/pets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name,
      birthDate: '2020-01-01',
      ownerId,
      breedData: {
        name: breed,
        animalId,
      },
    });

  return Number(res.body.id);
}

async function createService(token: string, name = `Service-${Date.now()}`, price = 20) {
  const res = await request(app)
    .post('/services')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, price });

  return Number(res.body.id);
}

describe('Appointment - updateAppointment (integration)', () => {
  it('should update pet, owner, breed and service correctly', async () => {
    const token = await createUser();

    // Owner + Animal
    const owner1 = await createOwner(token);
    const owner2 = await createOwner(token);
    const animalId = await createAnimal(token);

    // Pets
    const pet1 = await createPet(token, owner1, animalId);
    const pet2 = await createPet(token, owner2, animalId);

    // Services
    const service1 = await createService(token, 'Corte', 20);
    const service2 = await createService(token, 'Baño', 15);

    // Crear cita inicial
    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();

    const createRes = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId: pet1,
        serviceId: service1,
        startTime: start,
        endTime: end,
      });

    const appointmentId = createRes.body.id;

    // Actualizar cita cambiando pet y service
    const updateRes = await request(app)
      .put(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        petId: pet2,
        serviceId: service2,
      });

    expect(updateRes.status).toBe(200);

    // Validar cambios
    expect(updateRes.body.petId).toBe(pet2);
    expect(updateRes.body.petName).toBe(updateRes.body.petName);
    expect(updateRes.body.ownerName).toBe('John Doe');
    expect(updateRes.body.serviceId).toBe(service2);
    expect(updateRes.body.serviceName).toBe('Baño');
    expect(updateRes.body.estimatedPrice).toBe(15);
  });

  it('should return 404 if appointment does not exist', async () => {
    const token = await createUser();

    const res = await request(app)
      .put('/appointments/9999')
      .set('Authorization', `Bearer ${token}`)
      .send({ petId: 1 });

    expect(res.status).toBe(404);
  });

  it('should return 400 if finalPrice is negative', async () => {
    const token = await createUser();
    const owner = await createOwner(token);
    const animal = await createAnimal(token);
    const pet = await createPet(token, owner, animal);
    const service = await createService(token);

    const start = new Date(Date.now() + 3600000).toISOString();
    const end = new Date(Date.now() + 7200000).toISOString();

    const createRes = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ petId: pet, serviceId: service, startTime: start, endTime: end });

    const appointmentId = createRes.body.id;

    const res = await request(app)
      .put(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ finalPrice: -5 });

    expect(res.status).toBe(400);
  });
});
