import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createUser(emailOverride?: string) {
  const email = emailOverride ?? `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const res = await request(app).post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return { token: res.body.accessToken, email };
}

describe('User integration - updateMyProfile', () => {
  it('should update user profile successfully', async () => {
    const { token } = await createUser();

    const res = await request(app)
      .put('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Updated', lastName: 'User' });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Updated');
  });

  it('should return 400 for invalid email', async () => {
    const { token } = await createUser();

    const res = await request(app)
      .put('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'email')).toBe(true);
  });

  it('should return 409 for duplicate email', async () => {
    const userA = await createUser('a@test.com');
    const userB = await createUser('b@test.com');

    const res = await request(app)
      .put('/users/me')
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ email: 'a@test.com' });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('already in use');
  });

  it('should return 401 if token is missing', async () => {
    const res = await request(app).put('/users/me').send({ firstName: 'X' });
    expect(res.status).toBe(401);
  });
});
