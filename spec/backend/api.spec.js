const request = require('supertest');
const app = require('../../backend/server'); 

describe('POST /api/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'newuser', password: 'pass123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe('newuser');
  });

  it('should reject duplicate username', async () => {
    await request(app)
      .post('/api/register')
      .send({ username: 'duplicate', password: 'pass123' });

      const res = await request(app)
      .post('/api/register')
      .send({ username: 'duplicate', password: 'pass123' });
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });
});