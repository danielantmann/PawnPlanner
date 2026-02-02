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

describe('Animal - UpdateAnimal (integration)', () => {
  it('should update an animal successfully', async () => {
    const token = await createUser();

    const createRes = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const id = createRes.body.id;

    const res = await apiRequest
      .put(`/animals/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Wolf' });

    expect(res.status).toBe(200);
    expect(res.body.species).toBe('Wolf');
  });

  it('should return 400 for invalid species', async () => {
    const token = await createUser();

    const createRes = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const id = createRes.body.id;

    const res = await apiRequest
      .put(`/animals/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'a' });

    expect(res.status).toBe(400);
  });

  it('should return 404 if animal does not exist', async () => {
    const token = await createUser();

    const res = await apiRequest
      .put('/animals/9999')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Wolf' });

    expect(res.status).toBe(404);
  });
});
