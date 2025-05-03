const request = require('supertest');

describe('Job Seeker Login - Failure', () => {
  it('should fail to login with non-existent job seeker email', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send({
        email: 'nonexistent_jobseeker@example.com',
        password: 'WrongPass123',
      });

    expect(res.statusCode).toBe(401); // Unauthorized
    expect(res.body).toHaveProperty('message');
  });
});
