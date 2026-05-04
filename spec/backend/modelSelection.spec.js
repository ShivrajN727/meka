const request = require('supertest');
const app = require('../../backend/server');

jest.mock('../../backend/llm', () => ({
  callLLM: jest.fn().mockResolvedValue('Ollama response')
}));

jest.mock('../../backend/gemini', () => ({
  callGemini: jest.fn().mockResolvedValue('Gemini response')
}));

jest.mock('../../backend/weather', () => ({
  getWeather: jest.fn().mockResolvedValue('Weather in New York, US: 22°C, wind speed 15 km/h.')
}));

describe('Iteration 3 - Model Selection', () => {

  it('should use Ollama when model is not specified', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'Hello' });
    expect(res.statusCode).toBe(200);
    expect(res.body.response).toBe('Ollama response');
  });

  it('should use Gemini when model is gemini', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'Hello', model: 'gemini' });
    expect(res.statusCode).toBe(200);
    expect(res.body.response).toBe('Gemini response');
  });

  it('should detect weather query and return weather data', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'weather in New York' });
    expect(res.statusCode).toBe(200);
    expect(res.body.response).toContain('New York');
  });

  it('should return 400 when prompt is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});
    expect(res.statusCode).toBe(400);
  });

});
