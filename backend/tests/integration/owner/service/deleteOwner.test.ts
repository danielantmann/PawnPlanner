import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../../api/app';
import '../../../setup/test-setup';

describe('Owner service - deleteOwner', () => {
  it('should delete an existing owner successfully', async () => {
    const createRes = await request(app)
      .post('/owners')
      .send({ name: 'Daniel', phone: '1234567', email: 'dan@google.com' });
    const ownerId = createRes.body.id;

    const deleteRes = await request(app).delete(`/owners/${ownerId}`);
    expect(deleteRes.status).toBe(204);

    // comprobar que ya no existe
    const getRes = await request(app).get(`/owners/${ownerId}`);
    expect(getRes.status).toBe(404);
  });

  it('should return 404 if owner does not exist', async () => {
    const res = await request(app).delete('/owners/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });
});
