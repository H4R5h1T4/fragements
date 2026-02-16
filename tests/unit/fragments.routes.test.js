const request = require('supertest');
const app = require('../../src/app');

function basicAuth(email = 'test-user1@fragments-testing.com', password = 'test-password1') {
  const token = Buffer.from(`${email}:${password}`).toString('base64');
  return `Basic ${token}`;
}

describe('Fragments API routes', () => {
  test('POST /v1/fragments creates a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .set('Content-Type', 'text/plain')
      .send('hello from test');

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toMatch(/\/v1\/fragments\/[0-9a-f-]+$/);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toContain('text/plain');
    expect(res.body.fragment.size).toBeGreaterThan(0);
  });

  test('GET /v1/fragments lists fragment ids', async () => {
    const created = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .set('Content-Type', 'text/plain')
      .send('list test');

    const id = created.body.fragment.id;

    const res = await request(app).get('/v1/fragments').set('Authorization', basicAuth());

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments).toContain(id);
  });

  test('GET /v1/fragments?expand=1 returns expanded fragments', async () => {
    const created = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .set('Content-Type', 'text/plain')
      .send('expand test');

    const id = created.body.fragment.id;

    const res = await request(app).get('/v1/fragments?expand=1').set('Authorization', basicAuth());

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.map((f) => f.id)).toContain(id);
  });

  test('GET /v1/fragments/:id/info returns metadata', async () => {
    const created = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .set('Content-Type', 'text/plain')
      .send('info test');

    const id = created.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .set('Authorization', basicAuth());

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toBe(id);
  });

  test('GET /v1/fragments/:id returns raw data', async () => {
    const text = 'raw data test';
    const created = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .set('Content-Type', 'text/plain')
      .send(text);

    const id = created.body.fragment.id;

    const res = await request(app).get(`/v1/fragments/${id}`).set('Authorization', basicAuth());

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toBe(text);
  });

  test('PUT /v1/fragments/:id updates data', async () => {
    const created = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .set('Content-Type', 'text/plain')
      .send('original');

    const id = created.body.fragment.id;

    const updatedText = 'UPDATED text here';
    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .set('Authorization', basicAuth())
      .set('Content-Type', 'text/plain')
      .send(updatedText);

    expect(res.statusCode).toBe(200);

    const getRes = await request(app).get(`/v1/fragments/${id}`).set('Authorization', basicAuth());

    expect(getRes.text).toBe(updatedText);
  });

  test('DELETE /v1/fragments/:id deletes fragment', async () => {
    const created = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .set('Content-Type', 'text/plain')
      .send('delete me');

    const id = created.body.fragment.id;

    const delRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .set('Authorization', basicAuth());

    expect(delRes.statusCode).toBe(200);

    const infoRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .set('Authorization', basicAuth());

    
    expect(infoRes.statusCode).toBe(500);
  });

  test('POST /v1/fragments fails without Content-Type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .send('no content type');

    expect(res.statusCode).toBe(400);
  });

  test('POST /v1/fragments fails for unsupported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Authorization', basicAuth())
      .set('Content-Type', 'application/msword')
      .send('bad');

    expect(res.statusCode).toBe(415);
  });
});
