import request from 'supertest';
import app from '../../../api/app';
import { describe, it, expect } from 'vitest';
import '../../setup/test-setup';

describe('POST /auth/change-password', () => {
  it('should change password successfully with correct oldPassword', async () => {
    const email = `changepass-${Date.now()}@test.com`;
    const oldPassword = 'Password123!';
    const newPassword = 'Newpass123!';

    await request(app).post('/auth/register').send({
      email,
      password: oldPassword,
      firstName: 'Change',
      lastName: 'User',
    });

    const loginRes = await request(app).post('/auth/login').send({ email, password: oldPassword });
    const token = loginRes.body.accessToken;

    const res = await request(app)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword, newPassword });

    expect(res.status).toBe(200);
  });

  it('should return 401 if oldPassword is incorrect', async () => {
    const email = `changepass-${Date.now()}@test.com`;
    const oldPassword = 'Password123!';
    const wrongPassword = 'Wrongpass123!';
    const newPassword = 'Newpass123!';

    await request(app).post('/auth/register').send({
      email,
      password: oldPassword,
      firstName: 'Change',
      lastName: 'User',
    });

    const loginRes = await request(app).post('/auth/login').send({ email, password: oldPassword });
    const token = loginRes.body.accessToken;

    const res = await request(app)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: wrongPassword, newPassword });

    expect(res.status).toBe(401);
  });

  it('should return 400 if newPassword does not meet DTO rules', async () => {
    const email = `changepass-${Date.now()}@test.com`;
    const oldPassword = 'Password123!';
    const invalidNewPassword = '12';

    await request(app).post('/auth/register').send({
      email,
      password: oldPassword,
      firstName: 'Change',
      lastName: 'User',
    });

    const loginRes = await request(app).post('/auth/login').send({ email, password: oldPassword });
    const token = loginRes.body.accessToken;

    const res = await request(app)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword, newPassword: invalidNewPassword });

    expect(res.status).toBe(400);
  });
});
