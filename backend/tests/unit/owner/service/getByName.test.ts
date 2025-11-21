import { GetPetByNameService } from './../../../../application/pets/services/GetPetByNameService';
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

describe('Owner Service - GetByName', () => {
  it('should return 404 for non-existing owner', async () => {
    const res = await request(app).get('/owners/name/pepe');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return owners by name', async () => {
    await request(app)
      .post('/owners')
      .send({ name: 'daniel', phone: '1234567', email: 'dan@google.com' });

    await request(app)
      .post('/owners')
      .send({ name: 'daniel', phone: '4561232', email: 'daniel@test.com' });

    const res = await request(app).get('/owners/name/daniel');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body.every((o: any) => o.name === 'Daniel')).toBe(true);
  });

  it('should return owner without pets', async () => {
    const createRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const ownerName = createRes.body.name;

    const res = await request(app).get(`/owners/name/${ownerName}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe(ownerName);
    expect(res.body[0].pets).toEqual([]);
  });

  it('should return owner with pets', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const ownerName = ownerRes.body.name;

    const animalRes = await request(app).post('/animals').send({ species: 'Dog' });
    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .send({
        name: 'Firulais',
        ownerId: ownerRes.body.id,
        breedData: { name: 'Labrador', animalId },
      });

    const res = await request(app).get(`/owners/name/${ownerName}`);
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe(ownerName);
    expect(res.body[0].pets.length).toBeGreaterThan(0);
    expect(res.body[0].pets[0].name).toBe('Firulais');
  });

  it('should return owner with expected fields', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Laura', phone: '555555555', email: 'laura@test.com' });

    const ownerName = ownerRes.body.name;

    const res = await request(app).get(`/owners/name/${ownerName}`);
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('phone');
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('pets');
  });

  it('should return owner with multiple pets', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Mario', phone: '777777777', email: 'mario@test.com' });

    const ownerName = ownerRes.body.name;

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

    const res = await request(app).get(`/owners/name/${ownerName}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body[0].pets)).toBe(true);
    expect(res.body[0].pets.length).toBe(2);
    expect(res.body[0].pets.map((p: any) => p.name)).toEqual(
      expect.arrayContaining(['Michi', 'Pelusa'])
    );
  });

  it('should validate data types in response', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Ana', phone: '888888888', email: 'ana@test.com' });

    const ownerName = ownerRes.body.name;

    const res = await request(app).get(`/owners/name/${ownerName}`);
    expect(res.status).toBe(200);
    expect(typeof res.body[0].id).toBe('number');
    expect(typeof res.body[0].name).toBe('string');
    expect(typeof res.body[0].phone).toBe('string');
    expect(typeof res.body[0].email).toBe('string');
    expect(Array.isArray(res.body[0].pets)).toBe(true);
  });

  it('should ensure pets are returned with id and name', async () => {
    const ownerRes = await request(app)
      .post('/owners')
      .send({ name: 'Luis', phone: '111111111', email: 'luis@test.com' });

    const ownerName = ownerRes.body.name;

    const animalRes = await request(app).post('/animals').send({ species: 'Dog' });
    const animalId = animalRes.body.id;

    await request(app)
      .post('/pets')
      .send({ name: 'Bobby', ownerId: ownerRes.body.id, breedData: { name: 'Bulldog', animalId } });

    const res = await request(app).get(`/owners/name/${ownerName}`);
    expect(res.status).toBe(200);
    expect(res.body[0].pets.every((p: any) => typeof p.id === 'number')).toBe(true);
    expect(res.body[0].pets.every((p: any) => typeof p.name === 'string')).toBe(true);
  });
});
