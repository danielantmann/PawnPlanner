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

describe('Animal - GetAnimalById (integration)', () => {
  it('should return an animal by id', async () => {
    const token = await createUser();

    const createRes = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const id = createRes.body.id;

    const res = await request(app).get(`/animals/${id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.species).toBe('Dog');
  });

  it('should return 404 if animal does not exist', async () => {
    const token = await createUser();

    const res = await request(app).get('/animals/9999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/animals/1');
    expect(res.status).toBe(401);
  });
});
