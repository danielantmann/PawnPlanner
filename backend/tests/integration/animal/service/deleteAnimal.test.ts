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

describe('Animal - DeleteAnimal (integration)', () => {
  it('should delete an animal successfully', async () => {
    const token = await createUser();

    const createRes = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const id = createRes.body.id;

    const res = await apiRequest.delete(`/animals/${id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 if animal does not exist', async () => {
    const token = await createUser();

    const res = await apiRequest.delete('/animals/9999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await apiRequest.delete('/animals/1');
    expect(res.status).toBe(401);
  });
});
