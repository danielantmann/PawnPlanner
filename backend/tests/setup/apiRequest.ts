import request from 'supertest';
import app from '../../api/app';

const API_PREFIX = '/api/v1';

export const apiRequest = {
  get: (path: string) => request(app).get(`${API_PREFIX}${path}`),
  post: (path: string) => request(app).post(`${API_PREFIX}${path}`),
  put: (path: string) => request(app).put(`${API_PREFIX}${path}`),
  delete: (path: string) => request(app).delete(`${API_PREFIX}${path}`),
};
