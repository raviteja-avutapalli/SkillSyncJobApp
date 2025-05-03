const request = require('supertest');

describe('Job Application - Failure', () => {
  it('should fail to apply without required fields', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/applications')
      .send({
        // Missing userId and jobId
        coverLetter: 'I forgot to include job and user!',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
