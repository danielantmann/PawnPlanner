import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createUser() {
  const email = `user-${Date.now()}-breed@test.com`;
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

async function createBreed(token: string, animalId: number, name = 'Labrador') {
  const res = await request(app)
    .post('/breeds')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, animalId });

  return res.body;
}

describe('Breed - GetBreedsByName Controller (integration)', () => {
  it('should return breeds by name', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    const breed1 = await createBreed(token, animalId, 'Labrador');
    const breed2 = await createBreed(token, animalId, 'Labrador');

    const res = await request(app)
      .get('/breeds/name/Labrador')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body.some((b: any) => b.id === breed1.id)).toBe(true);
    expect(res.body.some((b: any) => b.id === breed2.id)).toBe(true);
  });

  it('should return empty array if no breeds match name', async () => {
    const token = await createUser();

    const res = await request(app)
      .get('/breeds/name/NonexistentBreed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).get('/breeds/name/Labrador');

    expect(res.status).toBe(401);
  });

  it('should search case-insensitively', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    await createBreed(token, animalId, 'Poodle');

    const resLower = await request(app)
      .get('/breeds/name/poodle')
      .set('Authorization', `Bearer ${token}`);

    const resUpper = await request(app)
      .get('/breeds/name/POODLE')
      .set('Authorization', `Bearer ${token}`);

    expect(resLower.status).toBe(200);
    expect(resLower.body.length).toBeGreaterThan(0);
    expect(resUpper.status).toBe(200);
    expect(resUpper.body.length).toBeGreaterThan(0);
  });

  it('should only return breeds from authenticated user', async () => {
    const token1 = await createUser();
    const token2 = await createUser();

    const animalId1 = await createAnimal(token1);
    const animalId2 = await createAnimal(token2);

    const breed1 = await createBreed(token1, animalId1, 'GoldenRetriever');
    const breed2 = await createBreed(token2, animalId2, 'GoldenRetriever');

    const res1 = await request(app)
      .get('/breeds/name/GoldenRetriever')
      .set('Authorization', `Bearer ${token1}`);

    expect(res1.status).toBe(200);
    expect(res1.body.some((b: any) => b.id === breed1.id)).toBe(true);
    expect(res1.body.some((b: any) => b.id === breed2.id)).toBe(false);
  });

  it('should return breeds with special characters in name', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    const breed = await createBreed(token, animalId, 'Shih-Tzu');

    const res = await request(app)
      .get('/breeds/name/Shih-Tzu')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return different results for different names', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    const breed1 = await createBreed(token, animalId, 'Beagle');
    const breed2 = await createBreed(token, animalId, 'Bulldog');

    const res1 = await request(app)
      .get('/breeds/name/Beagle')
      .set('Authorization', `Bearer ${token}`);

    const res2 = await request(app)
      .get('/breeds/name/Bulldog')
      .set('Authorization', `Bearer ${token}`);

    const hasBeagle = res1.body.some((b: any) => b.id === breed1.id);
    const hasBulldog = res2.body.some((b: any) => b.id === breed2.id);

    expect(hasBeagle).toBe(true);
    expect(hasBulldog).toBe(true);
  });
});
