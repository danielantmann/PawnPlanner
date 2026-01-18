import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createTestUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const registerRes = await request(app).post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return registerRes.body.accessToken;
}

describe('Owner service - deleteOwner', () => {
  it('should delete an existing owner successfully', async () => {
    const token = await createTestUser();

    const createRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const ownerId = createRes.body.id;

    const deleteRes = await request(app)
      .delete(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    const getRes = await request(app)
      .get(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });

  it('should return 404 if owner does not exist', async () => {
    const token = await createTestUser();

    const res = await request(app).delete('/owners/9999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('not found');
  });

  it('should not allow deleting an owner belonging to another user', async () => {
    const tokenA = await createTestUser();
    const tokenB = await createTestUser();

    const createRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Laura', phone: '5555555', email: 'laura@test.com' });

    const ownerId = createRes.body.id;

    const deleteRes = await request(app)
      .delete(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(deleteRes.status).toBe(404);
    expect(deleteRes.body.message).toContain('not found');
  });
});
