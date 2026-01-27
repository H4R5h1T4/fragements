const request = require('supertest');
const app = require('../../src/app');

describe('App 404 and error handling', () => {
  test('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/nonexistent-route');
    expect(res.statusCode).toBe(404);
  });

  test('should return 500 for errors thrown in middleware', async () => {
    const res = await request(app).get('/error-test');
    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('test error');
    expect(res.body.error.code).toBe(500);
  });

  test('should return 200 for success-test route', async () => {
    const res = await request(app).get('/success-test');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
