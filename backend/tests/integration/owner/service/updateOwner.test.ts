import { describe, it, expect } from 'vitest';
import '../../../setup/test-setup';
import { apiRequest } from '../../../setup/apiRequest';

async function createTestUser() {
  const email = `user-${Date.now()}@test.com`;
  const password = 'Password123!';

  const registerRes = await apiRequest.post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return registerRes.body.accessToken;
}

describe('Owner service - updateOwner', () => {
  it('should update an existing owner successfully', async () => {
    const token = await createTestUser();

    const createRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const ownerId = createRes.body.id;

    const updateRes = await apiRequest
      .put(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel Updated', phone: '7654321' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Daniel Updated');
    expect(updateRes.body.phone).toBe('7654321');
    expect(updateRes.body.email).toBe('dan@google.com');
  });

  it('should return 404 if owner does not exist', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .put('/owners/9999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ghost' });

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('not found');
  });

  it('should return 400 if new email is invalid', async () => {
    const token = await createTestUser();

    const createRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ana', phone: '1111111', email: 'ana@test.com' });

    const ownerId = createRes.body.id;

    const res = await apiRequest
      .put(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'email')).toBe(true);
  });

  it('should return 400 if new phone is invalid', async () => {
    const token = await createTestUser();

    const createRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Luis', phone: '2222222', email: 'luis@test.com' });

    const ownerId = createRes.body.id;

    const res = await apiRequest
      .put(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '12' });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'phone')).toBe(true);
  });

  it('should detect duplicate email on update', async () => {
    const token = await createTestUser();

    await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Laura', phone: '3333333', email: 'laura@test.com' });

    const owner2 = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mario', phone: '4444444', email: 'mario@test.com' });

    const res = await apiRequest
      .put(`/owners/${owner2.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'laura@test.com' });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('email');
  });

  it('should detect duplicate phone on update', async () => {
    const token = await createTestUser();

    await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Carlos', phone: '5555555', email: 'carlos@test.com' });

    const owner2 = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pepe', phone: '6666666', email: 'pepe@test.com' });

    const res = await apiRequest
      .put(`/owners/${owner2.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '5555555' });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('phone');
  });
});
