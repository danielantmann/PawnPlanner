import { GetPetByNameService } from '../../../../application/pets/services/GetPetByNameService';
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

describe('Owner Service - GetById', () => {
  it('should return 404 for non-existing owner', async () => {
    const res = await request(app).get('/owners/999');
    expect(res.status).toBe(404);
  });

  it('should return owners without pets', async () => {
    const createRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const ownerId = createRes.body.id;

    const res = await request(app).get(`/owners/${ownerId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ownerId);
    expect(res.body.name).toBe('Daniel');
    expect(res.body.pets).toEqual([]);
  });

  it('should return owner with pets', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const ownerId = ownerRes.body.id;

    const animalRes = await request(app).post('/animals').send({ species: 'Dog' });
    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .send({
        name: 'Firulais',
        ownerId,
        breedData: {
          name: 'Labrador',
          animalId,
        },
      });

    const res = await request(app).get(`/owners/${ownerId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ownerId);
    expect(res.body.pets.length).toBeGreaterThan(0);
    expect(res.body.pets[0].name).toBe('Firulais');
  });

  it('should return owner with expected fields', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Laura', phone: '555555555', email: 'laura@test.com' });

    const ownerId = ownerRes.body.id;

    const res = await request(app).get(`/owners/${ownerId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('phone');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('pets');
  });

  it('should return owner with multiple pets', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Mario', phone: '777777777', email: 'mario@test.com' });
    const ownerId = ownerRes.body.id;

    const animalRes = await request(app).post('/animals').send({ species: 'Cat' });
    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .send({
        name: 'Michi',
        ownerId,
        breedData: { name: 'Siamese', animalId },
      });

    await request(app)
      .post('/pets')
      .send({
        name: 'Pelusa',
        ownerId,
        breedData: { name: 'Persian', animalId },
      });

    const res = await request(app).get(`/owners/${ownerId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.pets)).toBe(true);
    expect(res.body.pets.length).toBe(2);
    expect(res.body.pets.map((p: any) => p.name)).toEqual(
      expect.arrayContaining(['Michi', 'Pelusa'])
    );
  });

  it('should return 400 for invalid id format', async () => {
    const res = await request(app).get('/owners/abc');
    expect(res.status).toBe(400);
  });

  it('should validate data types in response', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Ana', phone: '888888888', email: 'ana@test.com' });
    const ownerId = ownerRes.body.id;

    const res = await request(app).get(`/owners/${ownerId}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.id).toBe('number');
    expect(typeof res.body.name).toBe('string');
    expect(typeof res.body.phone).toBe('string');
    expect(typeof res.body.email).toBe('string');
    expect(Array.isArray(res.body.pets)).toBe(true);
  });

  it('should ensure pets belong to the owner', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Luis', phone: '111111111', email: 'luis@test.com' });
    const ownerId = ownerRes.body.id;

    const animalRes = await request(app).post('/animals').send({ species: 'Dog' });
    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .send({
        name: 'Bobby',
        ownerId,
        breedData: { name: 'Bulldog', animalId },
      });

    const res = await request(app).get(`/owners/${ownerId}`);
    expect(res.status).toBe(200);
    expect(res.body.pets.every((p: any) => typeof p.id === 'number')).toBe(true);
    expect(res.body.pets.every((p: any) => typeof p.name === 'string')).toBe(true);
  });
});
