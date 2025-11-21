import { IsEmail } from 'class-validator';
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

describe('Owner service - getOwnerByEmail', () => {
  it('should return 404 for non-existing owner', async () => {
    const res = await request(app).get('/owners/email/pepe@google.com');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should return owner by email', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const ownerEmail = ownerRes.body.email;

    const response = await request(app).get(`/owners/email/${ownerEmail}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Daniel');
    expect(response.body.email).toBe(ownerEmail);
  });

  it('should return owner without pets', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const ownerEmail = ownerRes.body.email;

    const response = await request(app).get(`/owners/email/${ownerEmail}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Daniel');
    expect(response.body.email).toBe(ownerEmail);
    expect(response.body.pets).toEqual([]);
  });

  it('should return owner wit pets', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const ownerEmail = ownerRes.body.email;

    const animalRes = await request(app).post('/animals').send({ species: 'Dog' });
    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .send({
        name: 'Firulais',
        ownerId: ownerRes.body.id,
        breedData: { name: 'Labrador', animalId },
      });

    const response = await request(app).get(`/owners/email/${ownerEmail}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Daniel');
    expect(response.body.email).toBe(ownerEmail);
    expect(response.body.pets.length).toBeGreaterThan(0);
    expect(response.body.pets[0].name).toBe('Firulais');
  });

  it('should return owner with multiple pets', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Luis', phone: '111111111', email: 'luis@test.com' });

    const ownerEmail = ownerRes.body.email;

    const animalRes = await request(app).post('/animals').send({ species: 'Cat' });
    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .send({ name: 'Michi', ownerId: ownerRes.body.id, breedData: { name: 'Siamese', animalId } });

    await request(app)
      .post('/pets')
      .send({
        name: 'Pelusa',
        ownerId: ownerRes.body.id,
        breedData: { name: 'Persian', animalId },
      });

    const res = await request(app).get(`/owners/email/${ownerEmail}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.pets)).toBe(true);
    expect(res.body.pets.length).toBe(2);
    expect(res.body.pets.map((p: any) => p.name)).toEqual(
      expect.arrayContaining(['Michi', 'Pelusa'])
    );
  });

  it('should validate data types in response', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Carlos', phone: '999999999', email: 'carlos@test.com' });

    const ownerEmail = ownerRes.body.email;

    const res = await request(app).get(`/owners/email/${ownerEmail}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.id).toBe('number');
    expect(typeof res.body.name).toBe('string');
    expect(typeof res.body.phone).toBe('string');
    expect(typeof res.body.email).toBe('string');
    expect(Array.isArray(res.body.pets)).toBe(true);
  });

  it('should ensure pets are returned with id and name', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Sofia', phone: '222222222', email: 'sofia@test.com' });

    const ownerEmail = ownerRes.body.email;

    const animalRes = await request(app).post('/animals').send({ species: 'Dog' });
    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .send({ name: 'Bobby', ownerId: ownerRes.body.id, breedData: { name: 'Bulldog', animalId } });

    const res = await request(app).get(`/owners/email/${ownerEmail}`);
    expect(res.status).toBe(200);
    expect(res.body.pets.every((p: any) => typeof p.id === 'number')).toBe(true);
    expect(res.body.pets.every((p: any) => typeof p.name === 'string')).toBe(true);
  });
});
