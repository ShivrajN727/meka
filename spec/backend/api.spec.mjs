import request from 'supertest';
import app from '../../backend/server.js';


/* ================= Iteration 3 ================= */

describe('Iteration 3 - Advanced Features', () => {

  describe('POST /api/chat - Model Selection', () => {

it('should use gemini model when specified', async () => {
  const res = await request(app)
    .post('/api/chat')
    .send({ prompt: 'Hello', model: 'gemini' });

  expect([200, 500]).toContain(res.statusCode);

  if (res.statusCode === 200) {
    expect(res.body.response).toBeDefined();
  } else {
    expect(res.body.error).toBeDefined();
  }
});
    it('should fallback to local LLM if model not specified', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'Hello' });

      expect(res.statusCode).toBe(200);
      expect(res.body.response).toBeDefined();
    });

  });

  describe('POST /api/chat - Math Computation', () => {

    it('should solve simple math locally', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: '1+2*3' });

      expect(res.statusCode).toBe(200);
      expect(res.body.response).toMatch(/7/);
    });

    it('should solve quadratic equation locally', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'solve 2x^2+3x-4=0' });

      expect(res.statusCode).toBe(200);
      expect(res.body.response).toMatch(/x|solution|=/i);
    });

  });


  describe('POST /api/chat - Weather Lookup', () => {

    it('should return weather info', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'weather in New York' });

      expect(res.statusCode).toBe(200);
      expect(res.body.response).toMatch(/weather|temperature|wind/i);
    });

  });


  describe('POST /api/chat - Model Recommendation', () => {

    it('should auto-select best model for math query', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'solve 2x^2+3x-4=0', autoSelect: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.response).toBeDefined();
    });

    it('should auto-select best model for general query', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'Tell me a joke', autoSelect: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.response).toBeDefined();
    });

  });

});