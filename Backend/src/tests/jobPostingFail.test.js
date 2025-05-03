const request = require('supertest');

describe('Job Posting - Failure', () => {
  it('should fail to post job with missing required fields', async () => {
    const incompleteJob = {
      company: 'Missing Title Inc.',
      location: 'Unknown',
    };

    const res = await request('http://localhost:5000')
      .post('/api/jobs')
      .send(incompleteJob);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
