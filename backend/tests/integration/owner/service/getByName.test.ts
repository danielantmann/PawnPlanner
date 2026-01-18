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

describe('Owner Service - GetByName', () => {
  it('should return 200 and empty array for non-existing owner', async () => {
    const token = await createTestUser();

    const res = await request(app).get('/owners/name/pepe').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return owners by name', async () => {
    const token = await createTestUser();

    await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'daniel', phone: '1234567', email: 'dan@google.com' });

    await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'daniel', phone: '4561232', email: 'daniel@test.com' });

    const res = await request(app)
      .get('/owners/name/daniel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body.every((o: any) => o.name === 'Daniel')).toBe(true);
  });

  it('should return owner without pets', async () => {
    const token = await createTestUser();

    const createRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const ownerName = createRes.body.name;

    const res = await request(app)
      .get(`/owners/name/${ownerName}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe(ownerName);
    expect(res.body[0].pets).toEqual([]);
  });

  it('should return owner with pets', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const ownerName = ownerRes.body.name;

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
        ownerId: ownerRes.body.id,
        breedData: { name: 'Labrador', animalId },
      });

    const res = await request(app)
      .get(`/owners/name/${ownerName}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].pets.length).toBeGreaterThan(0);
    expect(res.body[0].pets[0].name).toBe('Firulais');
  });

  it('should return owner with expected fields', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Laura', phone: '555555555', email: 'laura@test.com' });

    const ownerName = ownerRes.body.name;

    const res = await request(app)
      .get(`/owners/name/${ownerName}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('phone');
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('pets');
  });

  it('should return owner with multiple pets', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mario', phone: '777777777', email: 'mario@test.com' });

    const ownerName = ownerRes.body.name;

    const animalRes = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Cat' });

    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Michi', ownerId: ownerRes.body.id, breedData: { name: 'Siamese', animalId } });

    await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pelusa',
        ownerId: ownerRes.body.id,
        breedData: { name: 'Persian', animalId },
      });

    const res = await request(app)
      .get(`/owners/name/${ownerName}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].pets.length).toBe(2);
  });

  it('should validate data types in response', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ana', phone: '888888888', email: 'ana@test.com' });

    const ownerName = ownerRes.body.name;

    const res = await request(app)
      .get(`/owners/name/${ownerName}`)
      .set('Authorization', `Bearer ${token}`);

    expect(typeof res.body[0].id).toBe('number');
    expect(typeof res.body[0].name).toBe('string');
    expect(typeof res.body[0].phone).toBe('string');
    expect(typeof res.body[0].email).toBe('string');
    expect(Array.isArray(res.body[0].pets)).toBe(true);
  });

  it('should ensure pets are returned with id and name', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Luis', phone: '111111111', email: 'luis@test.com' });

    const ownerName = ownerRes.body.name;

    const animalRes = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bobby', ownerId: ownerRes.body.id, breedData: { name: 'Bulldog', animalId } });

    const res = await request(app)
      .get(`/owners/name/${ownerName}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.body[0].pets.every((p: any) => typeof p.id === 'number')).toBe(true);
    expect(res.body[0].pets.every((p: any) => typeof p.name === 'string')).toBe(true);
  });
});
