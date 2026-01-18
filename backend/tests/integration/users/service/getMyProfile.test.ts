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

describe('User integration - getMyProfile', () => {
  it('should return the authenticated user profile', async () => {
    const { token, email } = await createUser();

    const res = await request(app).get('/users/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('firstName');
    expect(res.body).toHaveProperty('lastName');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/users/me');
    expect(res.status).toBe(401);
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request(app).get('/users/me').set('Authorization', 'Bearer invalidtoken');

    expect(res.status).toBe(401);
  });
});
