const request = require('supertest');

describe('Job Posting - Success', () => {
  const job = {
    title: 'Software Engineer',
    company: 'Tech Corp',
    description: 'Build modern backend services.',
    location: 'Remote',
    salary: '120000',
  };

  it('should post a new job successfully', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/jobs')
      .send(job);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('jobId');
  });
});
