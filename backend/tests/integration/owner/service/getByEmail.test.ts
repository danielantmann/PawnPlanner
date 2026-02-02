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

describe('Owner service - getOwnerByEmail', () => {
  it('should return 404 for non-existing owner', async () => {
    const token = await createTestUser();

    const res = await apiRequest
      .get('/owners/email/pepe@google.com')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('not found');
  });

  it('should return owner by email', async () => {
    const token = await createTestUser();

    const ownerRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const ownerEmail = ownerRes.body.email;

    const response = await apiRequest
      .get(`/owners/email/${ownerEmail}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Daniel');
    expect(response.body.email).toBe(ownerEmail);
  });

  it('should return owner without pets', async () => {
    const token = await createTestUser();

    const ownerRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const ownerEmail = ownerRes.body.email;

    const response = await apiRequest
      .get(`/owners/email/${ownerEmail}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.pets).toEqual([]);
  });

  it('should return owner with pets', async () => {
    const token = await createTestUser();

    const ownerRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });

    const ownerEmail = ownerRes.body.email;

    const animalRes = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const animalId = animalRes.body.id;

    await apiRequest
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Firulais',
        ownerId: ownerRes.body.id,
        breedData: { name: 'Labrador', animalId },
      });

    const response = await apiRequest
      .get(`/owners/email/${ownerEmail}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.pets.length).toBeGreaterThan(0);
    expect(response.body.pets[0].name).toBe('Firulais');
  });

  it('should return owner with multiple pets', async () => {
    const token = await createTestUser();

    const ownerRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Luis', phone: '111111111', email: 'luis@test.com' });

    const ownerEmail = ownerRes.body.email;

    const animalRes = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Cat' });

    const animalId = animalRes.body.id;

    await apiRequest
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Michi', ownerId: ownerRes.body.id, breedData: { name: 'Siamese', animalId } });

    await apiRequest
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pelusa',
        ownerId: ownerRes.body.id,
        breedData: { name: 'Persian', animalId },
      });

    const res = await apiRequest
      .get(`/owners/email/${ownerEmail}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.pets.length).toBe(2);
  });

  it('should validate data types in response', async () => {
    const token = await createTestUser();

    const ownerRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Carlos', phone: '999999999', email: 'carlos@test.com' });

    const ownerEmail = ownerRes.body.email;

    const res = await apiRequest
      .get(`/owners/email/${ownerEmail}`)
      .set('Authorization', `Bearer ${token}`);

    expect(typeof res.body.id).toBe('number');
    expect(typeof res.body.name).toBe('string');
    expect(typeof res.body.phone).toBe('string');
    expect(typeof res.body.email).toBe('string');
    expect(Array.isArray(res.body.pets)).toBe(true);
  });

  it('should ensure pets are returned with id and name', async () => {
    const token = await createTestUser();

    const ownerRes = await apiRequest
      .post('/owners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Sofia', phone: '222222222', email: 'sofia@test.com' });

    const ownerEmail = ownerRes.body.email;

    const animalRes = await apiRequest
      .post('/animals')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'Dog' });

    const animalId = animalRes.body.id;

    await apiRequest
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bobby', ownerId: ownerRes.body.id, breedData: { name: 'Bulldog', animalId } });

    const res = await apiRequest
      .get(`/owners/email/${ownerEmail}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.pets.every((p: any) => typeof p.id === 'number')).toBe(true);
    expect(res.body.pets.every((p: any) => typeof p.name === 'string')).toBe(true);
  });
});
