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

describe('Animal - CreateAnimal (integration)', () => {
  it('should create an animal successfully', async () => {
    const token = await createUser();

    const res = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.species).toBe('Dog');
  });

  it('should return 400 for invalid species', async () => {
    const token = await createUser();

    const res = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'a' }); // too short

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'species')).toBe(true);
  });

  it('should return 409 for duplicate species', async () => {
    const token = await createUser();

    await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Cat' });

    const res = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'cat' }); // normalized duplicate

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('already exists');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post('/animals').send({ species: 'Dog' });
    expect(res.status).toBe(401);
  });
});
