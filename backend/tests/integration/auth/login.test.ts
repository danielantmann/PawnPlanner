import { describe, it, expect } from 'vitest';
import '../../setup/test-setup';
import { apiRequest } from '../../setup/apiRequest';

describe('POST /auth/login', () => {
  it('should login successfully with valid credentials', async () => {
    const email = `login-${Date.now()}@test.com`;
    const password = 'Password123!';

    await apiRequest.post('/auth/register').send({
      email,
      password,
      firstName: 'Login',
      lastName: 'User',
    });

    const res = await apiRequest.post('/auth/login').send({ email, password });
    expect(res.status).toBe(200);
  });

  it('should return 401 if credentials are invalid', async () => {
    const email = `login-${Date.now()}@test.com`;
    const password = 'Password123!';

    await apiRequest.post('/auth/register').send({
      email,
      password,
      firstName: 'Login',
      lastName: 'User',
    });

    const res = await apiRequest.post('/auth/login').send({ email, password: 'Wrongpass123!' });
    expect(res.status).toBe(401);
  });

  it('should return 401 if email does not exist', async () => {
    const res = await apiRequest.post('/auth/login').send({
      email: `nonexistent-${Date.now()}@test.com`,
      password: 'Password123!',
    });

    expect(res.status).toBe(401);
  });

  it('should return 400 if password is too short', async () => {
    const email = `shortlogin-${Date.now()}@test.com`;

    await apiRequest.post('/auth/register').send({
      email,
      password: 'Password123!',
      firstName: 'Login',
      lastName: 'User',
    });

    const res = await apiRequest.post('/auth/login').send({ email, password: '12' });
    expect(res.status).toBe(400);
  });

  it('should login successfully with email containing spaces', async () => {
    const email = `login-space-${Date.now()}@test.com`;
    const password = 'Password123!';

    await apiRequest.post('/auth/register').send({
      email,
      password,
      firstName: 'Login',
      lastName: 'User',
    });

    const res = await apiRequest.post('/auth/login').send({
      email: ` ${email} `,
      password,
    });

    expect(res.status).toBe(200);
  });
});
