import request from 'supertest';
import app from '../../../api/app';
import { describe, it, expect } from 'vitest';
import '../../setup/test-setup';

describe('POST /auth/refresh', () => {
  it('should refresh tokens successfully with valid refresh token', async () => {
    const email = `refresh-${Date.now()}@test.com`;
    const password = 'Password123!';

    const registerRes = await request(app).post('/auth/register').send({
      email,
      password,
      firstName: 'Refresh',
      lastName: 'User',
    });

    const refreshToken = registerRes.body.refreshToken;

    const res = await request(app).post('/auth/refresh').send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('should return 401 if refresh token is invalid', async () => {
    const res = await request(app).post('/auth/refresh').send({ refreshToken: 'invalid-token' });
    expect(res.status).toBe(401);
  });

  it('should return 401 if refresh token is expired', async () => {
    const res = await request(app).post('/auth/refresh').send({ refreshToken: 'expired-token' });
    expect(res.status).toBe(401);
  });
});
