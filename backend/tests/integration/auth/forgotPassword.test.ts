import { describe, it, expect } from 'vitest';
import '../../setup/test-setup';
import { apiRequest } from '../../setup/apiRequest';

describe('POST /auth/forgot-password', () => {
  it('should return a resetToken if email exists', async () => {
    const email = `forgot-${Date.now()}@test.com`;

    await apiRequest.post('/auth/register').send({
      email,
      password: 'Password123!',
      firstName: 'Forgot',
      lastName: 'User',
    });

    const res = await apiRequest.post('/auth/forgot-password').send({ email });

    expect(res.status).toBe(200);
    expect(res.body.resetToken).toBeDefined();
  });

  it('should return 401 if email does not exist', async () => {
    const res = await apiRequest.post('/auth/forgot-password').send({
      email: `nonexistent-${Date.now()}@test.com`,
    });

    expect(res.status).toBe(401);
  });

  it('should return 400 if email is invalid', async () => {
    const res = await apiRequest.post('/auth/forgot-password').send({
      email: 'invalid-email',
    });

    expect(res.status).toBe(400);
  });
});
