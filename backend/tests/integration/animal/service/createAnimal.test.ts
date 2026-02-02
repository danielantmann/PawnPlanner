import { describe, it, expect } from 'vitest';
import '../../../setup/test-setup';
import { apiRequest } from '../../../setup/apiRequest';

async function createUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const res = await apiRequest.post('/auth/register').send({
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

    const res = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.species).toBe('Dog');
  });

  it('should return 400 for invalid species', async () => {
    const token = await createUser();

    const res = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'a' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'species')).toBe(true);
  });

  it('should return 409 for duplicate species', async () => {
    const token = await createUser();

    await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Cat' });

    const res = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'cat' });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('already exists');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await apiRequest.post('/animals').send({ species: 'Dog' });
    expect(res.status).toBe(401);
  });
});
