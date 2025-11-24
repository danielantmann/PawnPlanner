import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

describe('Owner service - updateOwner', () => {
  it('should update an existing owner successfully', async () => {
    const createRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });
    const ownerId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/owners/${ownerId}`)
      .send({ name: 'Daniel Updated', phone: '7654321' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Daniel Updated');
    expect(updateRes.body.phone).toBe('7654321');
    expect(updateRes.body.email).toBe('dan@google.com'); // unchanged
  });

  it('should return 404 if owner does not exist', async () => {
    const res = await request(app).put('/owners/9999').send({ name: 'Ghost' });

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });

  it('should return 400 if new email is invalid', async () => {
    const createRes = await request(app)
      .post('/owners')
      .send({ name: 'Ana', phone: '1111111', email: 'ana@test.com' });
    const ownerId = createRes.body.id;

    const res = await request(app).put(`/owners/${ownerId}`).send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.some((e: any) => e.property === 'email')).toBe(true);
  });

  it('should return 400 if new phone is invalid', async () => {
    const createRes = await request(app)
      .post('/owners')
      .send({ name: 'Luis', phone: '2222222', email: 'luis@test.com' });
    const ownerId = createRes.body.id;

    const res = await request(app).put(`/owners/${ownerId}`).send({ phone: '12' }); // too short

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.property === 'phone')).toBe(true);
  });

  it('should detect duplicate email on update', async () => {
    const owner1 = await request(app)
      .post('/owners')
      .send({ name: 'Laura', phone: '3333333', email: 'laura@test.com' });
    const owner2 = await request(app)
      .post('/owners')
      .send({ name: 'Mario', phone: '4444444', email: 'mario@test.com' });

    const res = await request(app)
      .put(`/owners/${owner2.body.id}`)
      .send({ email: 'laura@test.com' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('email');
  });

  it('should detect duplicate phone on update', async () => {
    const owner1 = await request(app)
      .post('/owners')
      .send({ name: 'Carlos', phone: '5555555', email: 'carlos@test.com' });
    const owner2 = await request(app)
      .post('/owners')
      .send({ name: 'Pepe', phone: '6666666', email: 'pepe@test.com' });

    const res = await request(app).put(`/owners/${owner2.body.id}`).send({ phone: '5555555' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('phone');
  });
});
