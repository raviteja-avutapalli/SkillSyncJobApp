const request = require('supertest');

describe('Employer Login', () => {
  const employer = {
    email: 'employer_' + Date.now() + '@example.com',
    password: 'EmployerPass123',
  };

  beforeAll(async () => {
    await request('http://localhost:5000')
      .post('/api/users/register')
      .send({
        name: 'Employer Test',
        email: employer.email,
        password: employer.password,
        role: 'employer' 
      });
  });

  it('should login successfully as employer', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send(employer);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
  });
});
