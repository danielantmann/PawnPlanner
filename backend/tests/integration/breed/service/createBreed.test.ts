import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

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

async function createAnimal(token: string, species = 'Dog') {
  const res = await request(app)
    .post('/animals')
    .set('Authorization', `Bearer ${token}`)
    .send({ species });

  return res.body.id;
}

describe('Breed - CreateBreed (integration)', () => {
  it('should create a breed successfully', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token, 'Dog');

    const res = await request(app)
      .post('/breeds')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Labrador', animalId });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Labrador');
    expect(res.body.animal.id).toBe(animalId);
    expect(res.body.animal.species).toBe('Dog');
  });

  it('should return 400 for invalid name', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    const res = await request(app)
      .post('/breeds')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'a', animalId });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'name')).toBe(true);
  });

  it('should return 404 if animal does not exist', async () => {
    const token = await createUser();

    const res = await request(app)
      .post('/breeds')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Labrador', animalId: 9999 });

    expect(res.status).toBe(404);
  });

  it('should return 409 for duplicate breed name for same animal', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    await request(app)
      .post('/breeds')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Labrador', animalId });

    const res = await request(app)
      .post('/breeds')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'labrador', animalId });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('already exists');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post('/breeds').send({ name: 'Labrador', animalId: 1 });
    expect(res.status).toBe(401);
  });
});
