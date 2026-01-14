import request from 'supertest';
import app from '../../../api/app';
import { describe, it, expect } from 'vitest';
import '../../setup/test-setup';

describe('POST /auth/reset-password', () => {
  it('should reset password successfully with valid token', async () => {
    const email = `reset-${Date.now()}@test.com`;
    const password = 'Password123!';

    await request(app)
      .post('/auth/register')
      .send({ email, password, firstName: 'Reset', lastName: 'User' });
    const forgotRes = await request(app).post('/auth/forgot-password').send({ email });
    const resetToken = forgotRes.body.resetToken;

    const res = await request(app)
      .post('/auth/reset-password')
      .send({ resetToken, newPassword: 'Newpass123!' });
    expect(res.status).toBe(200);
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ resetToken: 'invalid-token', newPassword: 'Newpass123!' });
    expect(res.status).toBe(401);
  });

  it('should return 401 if token is expired', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ resetToken: 'expired-token', newPassword: 'Newpass123!' });
    expect(res.status).toBe(401);
  });

  it('should return 400 if new password is too short', async () => {
    const email = `reset-short-${Date.now()}@test.com`;
    const password = 'Password123!';
    await request(app)
      .post('/auth/register')
      .send({ email, password, firstName: 'Reset', lastName: 'User' });
    const forgotRes = await request(app).post('/auth/forgot-password').send({ email });
    const resetToken = forgotRes.body.resetToken;

    const res = await request(app)
      .post('/auth/reset-password')
      .send({ resetToken, newPassword: '12' });
    expect(res.status).toBe(400);
  });

  it('should return 400 if new password is same as old one', async () => {
    const email = `reset-same-${Date.now()}@test.com`;
    const password = 'Password123!';
    await request(app)
      .post('/auth/register')
      .send({ email, password, firstName: 'Reset', lastName: 'User' });
    const forgotRes = await request(app).post('/auth/forgot-password').send({ email });
    const resetToken = forgotRes.body.resetToken;

    const res = await request(app)
      .post('/auth/reset-password')
      .send({ resetToken, newPassword: password });
    expect(res.status).toBe(400);
  });
});
