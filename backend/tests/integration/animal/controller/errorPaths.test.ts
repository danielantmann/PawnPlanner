import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

async function createTestUser() {
  const email = `user-${Date.now()}-animal-ctrl@test.com`;
  const password = 'Password123!';

  const registerRes = await request(app).post('/auth/register').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  return registerRes.body.accessToken;
}

describe('Animal Controller - Error Paths', () => {
  it('should return 401 when getting all animals without authentication', async () => {
    const res = await request(app).get('/animals');

    expect(res.status).toBe(401);
  });

  it('should return 401 when getting animal by id without authentication', async () => {
    const res = await request(app).get('/animals/1');

    expect(res.status).toBe(401);
  });

  it('should return 401 when creating animal without authentication', async () => {
    const res = await request(app).post('/animals').send({
      species: 'Dog',
    });

    expect(res.status).toBe(401);
  });

  it('should return 401 when updating animal without authentication', async () => {
    const res = await request(app).patch('/animals/1').send({
      species: 'Cat',
    });

    expect(res.status).toBe(401);
  });

  it('should return 401 when deleting animal without authentication', async () => {
    const res = await request(app).delete('/animals/1');

    expect(res.status).toBe(401);
  });

  it('should return 404 when getting non-existent animal', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .get('/animals/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('should return 404 when updating non-existent animal', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .patch('/animals/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Updated' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('should return 404 when deleting non-existent animal', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .delete('/animals/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 when creating animal with invalid species', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        species: '',
      });

    expect(res.status).toBe(400);
  });

  it('should return 400 when creating animal with missing required fields', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should return 409 when creating animal with duplicate species', async () => {
    const token = await createTestUser();

    // Create first animal
    await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        species: 'UniqueSpecies',
      });

    // Try to create second animal with same species
    const res = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        species: 'UniqueSpecies',
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it('should handle getBySpecies with non-existent species', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .get('/animals/species/NonExistentSpecies')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should handle invalid animal ID format', async () => {
    const token = await createTestUser();

    const res = await request(app)
      .get('/animals/invalid-id')
      .set('Authorization', `Bearer ${token}`);

    expect([400, 404]).toContain(res.status);
  });
});
