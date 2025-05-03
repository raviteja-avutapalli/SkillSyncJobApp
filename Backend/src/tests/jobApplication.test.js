const request = require('supertest');

describe('Job Application - Success', () => {
  let userId;
  let jobId;

  beforeAll(async () => {
    // Register user
    const userRes = await request('http://localhost:5000')
      .post('/api/users/register')
      .send({
        name: 'Applicant User',
        email: 'applicant_' + Date.now() + '@example.com',
        password: 'ApplyPass123',
      });
    userId = userRes.body.userId || 1;

    // Post job
    const jobRes = await request('http://localhost:5000')
      .post('/api/jobs')
      .send({
        title: 'QA Engineer',
        company: 'Quality Inc.',
        description: 'Test things.',
        location: 'Remote',
        salary: '80000',
      });
    jobId = jobRes.body.jobId || 1;
  });

  it('should allow a user to apply for a job', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/applications')
      .send({
        userId,
        jobId,
        coverLetter: 'I love testing.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Application submitted');

  });
});
