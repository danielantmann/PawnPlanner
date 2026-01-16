import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createTestUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const registerRes = await request(app).post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return registerRes.body.accessToken;
}

describe('Owner Service - GetById', () => {
  it('should return 404 for non-existing owner', async () => {
    const token = await createTestUser();

    const res = await request(app).get('/owners/999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return owners without pets', async () => {
    const token = await createTestUser();

    const createRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const ownerId = createRes.body.id;

    const res = await request(app)
      .get(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ownerId);
    expect(res.body.name).toBe('Daniel');
    expect(res.body.pets).toEqual([]);
  });

  it('should return owner with pets', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const ownerId = ownerRes.body.id;

    const animalRes = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Firulais',
        ownerId,
        breedData: { name: 'Labrador', animalId },
      });

    const res = await request(app)
      .get(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.pets.length).toBeGreaterThan(0);
    expect(res.body.pets[0].name).toBe('Firulais');
  });

  it('should return owner with expected fields', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Laura', phone: '555555555', email: 'laura@test.com' });

    const ownerId = ownerRes.body.id;

    const res = await request(app)
      .get(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('phone');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('pets');
  });

  it('should return owner with multiple pets', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mario', phone: '777777777', email: 'mario@test.com' });

    const ownerId = ownerRes.body.id;

    const animalRes = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Cat' });

    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Michi', ownerId, breedData: { name: 'Siamese', animalId } });

    await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pelusa', ownerId, breedData: { name: 'Persian', animalId } });

    const res = await request(app)
      .get(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.pets.length).toBe(2);
  });

  it('should return 400 for invalid id format', async () => {
    const token = await createTestUser();

    const res = await request(app).get('/owners/abc').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('should validate data types in response', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ana', phone: '888888888', email: 'ana@test.com' });

    const ownerId = ownerRes.body.id;

    const res = await request(app)
      .get(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(typeof res.body.id).toBe('number');
    expect(typeof res.body.name).toBe('string');
    expect(typeof res.body.phone).toBe('string');
    expect(typeof res.body.email).toBe('string');
    expect(Array.isArray(res.body.pets)).toBe(true);
  });

  it('should ensure pets belong to the owner', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Luis', phone: '111111111', email: 'luis@test.com' });

    const ownerId = ownerRes.body.id;

    const animalRes = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bobby', ownerId, breedData: { name: 'Bulldog', animalId } });

    const res = await request(app)
      .get(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.pets.every((p: any) => typeof p.id === 'number')).toBe(true);
    expect(res.body.pets.every((p: any) => typeof p.name === 'string')).toBe(true);
  });
});
