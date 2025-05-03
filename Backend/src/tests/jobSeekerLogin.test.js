const request = require('supertest');

describe('Job Seeker Login - Success', () => {
  const jobSeeker = {
    email: 'jobseeker_' + Date.now() + '@example.com',
    password: 'JobSeekerPass123',
  };

  beforeAll(async () => {
    await request('http://localhost:5000')
      .post('/api/users/register')
      .send({
        name: 'Job Seeker',
        email: jobSeeker.email,
        password: jobSeeker.password,
        role: 'jobseeker'  // 
      });
  });

  it('should login successfully as job seeker', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send(jobSeeker);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
  });
});
