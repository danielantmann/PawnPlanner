import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createTestUser() {
  const email = `user-${Date.now()}-ctrl@test.com`;
  const password = 'Password123!';

  const registerRes = await request(app).post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return registerRes.body.accessToken;
}

describe('Owner Controller - Error Paths', () => {
  it('should return 401 when getting all owners without authentication', async () => {
    const res = await request(app).get('/owners');

    expect(res.status).toBe(401);
  });

  it('should return 401 when getting owner by id without authentication', async () => {
    const res = await request(app).get('/owners/1');

    expect(res.status).toBe(401);
  });

  it('should return 401 when creating owner without authentication', async () => {
    const res = await request(app).post('/owners').send({
      name: 'Test',
      email: 'test@test.com',
      phone: '123456789',
    });

    expect(res.status).toBe(401);
  });

  it('should return 401 when updating owner without authentication', async () => {
    const res = await request(app).patch('/owners/1').send({
      name: 'Updated',
    });

    expect(res.status).toBe(401);
  });

  it('should return 401 when deleting owner without authentication', async () => {
    const res = await request(app).delete('/owners/1');

    expect(res.status).toBe(401);
  });

  it('should return 404 when getting non-existent owner', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .get('/owners/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('should return 404 when updating non-existent owner', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .patch('/owners/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('should return 404 when deleting non-existent owner', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .delete('/owners/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 when creating owner with invalid email', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test',
        email: 'invalid-email',
        phone: '123456789',
      });

    expect(res.status).toBe(400);
  });

  it('should return 400 when creating owner with missing required fields', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test',
        // missing email and phone
      });

    expect(res.status).toBe(400);
  });

  it('should return 409 when creating owner with duplicate email', async () => {
    const token = await createTestUser();
    const email = `duplicate-${Date.now()}@test.com`;

    // Create first owner
    await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Owner 1',
        email,
        phone: '123456789',
      });

    // Try to create second owner with same email
    const res = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Owner 2',
        email,
        phone: '987654321',
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });
});
