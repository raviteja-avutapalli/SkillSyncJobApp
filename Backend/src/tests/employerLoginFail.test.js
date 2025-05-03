const request = require('supertest');

describe('Employer Login - Failure', () => {
  const employer = {
    email: 'employer_' + Date.now() + '@example.com',
    password: 'CorrectPass123',
  };

  beforeAll(async () => {
    // Register employer
    await request('http://localhost:5000')
      .post('/api/users/register')
      .send({
        name: 'Employer User',
        email: employer.email,
        password: employer.password,
        role: 'employer'
      });
  });

  it('should fail to login with incorrect password', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send({
        email: employer.email,
        password: 'WrongPassword!',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
