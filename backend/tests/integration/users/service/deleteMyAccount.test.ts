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

  return { token: res.body.accessToken, email };
}

describe('User integration - deleteMyAccount', () => {
  it('should delete the authenticated user', async () => {
    const { token } = await createUser();

    const deleteRes = await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    // After deletion, token still decodes, but user no longer exists → 404
    const profileRes = await request(app).get('/users/me').set('Authorization', `Bearer ${token}`);

    expect(profileRes.status).toBe(404);
    expect(profileRes.body.error).toContain('not found');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).delete('/users/me');
    expect(res.status).toBe(401);
  });

  it('should return 401 for invalid token', async () => {
    const res = await request(app).delete('/users/me').set('Authorization', 'Bearer invalidtoken');

    expect(res.status).toBe(401);
  });
});
