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

async function createBreed(token: string, animalId: number, name: string) {
  return request(app)
    .post('/breeds')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, animalId });
}

describe('Breed - GetAllBreeds (integration)', () => {
  it('should return empty array when no breeds exist', async () => {
    const token = await createUser();

    const res = await request(app).get('/breeds').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all breeds for the user', async () => {
    const token = await createUser();
    const animalId = await createAnimal(token);

    await createBreed(token, animalId, 'Labrador');
    await createBreed(token, animalId, 'Beagle');

    const res = await request(app).get('/breeds').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.map((b: any) => b.name)).toEqual(
      expect.arrayContaining(['Labrador', 'Beagle'])
    );
  });
});
