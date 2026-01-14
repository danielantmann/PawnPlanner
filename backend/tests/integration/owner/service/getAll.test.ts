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

describe('OwnerService - getAll', () => {
  it('should return empty array initially', async () => {
    const token = await createTestUser();

    const res = await request(app).get('/owners').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return owners after creation', async () => {
    const token = await createTestUser();

    await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '123456789', email: 'dan@google.com' });

    const res = await request(app).get('/owners').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Daniel');
  });

  it('should return multiple owners when more are created', async () => {
    const token = await createTestUser();

    await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ana', phone: '111111111', email: 'ana@test.com' });

    await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Luis', phone: '222222222', email: 'luis@test.com' });

    const res = await request(app).get('/owners').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.map((o: any) => o.name)).toEqual(expect.arrayContaining(['Ana', 'Luis']));
  });

  it('should return owners with expected fields', async () => {
    const token = await createTestUser();

    await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Carlos', phone: '333333333', email: 'carlos@test.com' });

    const res = await request(app).get('/owners').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('phone');
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('pets');
  });

  it('should not include invalid owners after failed creation', async () => {
    const token = await createTestUser();

    const invalidRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pepe', phone: '444444444' });

    expect(invalidRes.status).toBe(400);

    const res = await request(app).get('/owners').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should remove owner after deletion', async () => {
    const token = await createTestUser();

    const createRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Laura', phone: '555555555', email: 'laura@test.com' });

    const ownerId = createRes.body.id;

    const deleteRes = await request(app)
      .delete(`/owners/${ownerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    const res = await request(app).get('/owners').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.find((o: any) => o.id === ownerId)).toBeUndefined();
  });

  it('should return owners with their pets', async () => {
    const token = await createTestUser();

    const ownerRes = await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mario', phone: '666666666', email: 'mario@test.com' });

    const ownerId = ownerRes.body.id;

    const animalRes = await request(app)
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const animalId = animalRes.body.id;

    const breedRes = await request(app)
      .post('/breeds')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Labrador', animalId });

    const breedId = breedRes.body.id;

    await request(app).post('/pets').set('Authorization', `Bearer ${token}`).send({
      name: 'Firulais',
      ownerId,
      breedId,
    });

    const res = await request(app).get('/owners').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const owner = res.body.find((o: any) => o.id === ownerId);
    expect(owner).toBeDefined();
    expect(owner.pets.length).toBeGreaterThan(0);
    expect(owner.pets[0].name).toBe('Firulais');
  });

  it('should not return owners belonging to another user', async () => {
    const tokenA = await createTestUser();
    const tokenB = await createTestUser();

    // Usuario A crea un owner
    await request(app)
      .post('/owners')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'PrivateOwner', phone: '999999999', email: 'private@test.com' });

    // Usuario B hace GET /owners
    const res = await request(app).get('/owners').set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
