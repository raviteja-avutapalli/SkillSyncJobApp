const request = require('supertest');

describe('Resume Upload - Failure', () => {
  it('should return error when no file is uploaded', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/resumes/upload');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
