const request = require('supertest');

describe('User Login - Success', () => {
  const validUser = {
    email: 'validuser_' + Date.now() + '@example.com',
    password: 'ValidPass123',
  };

  beforeAll(async () => {
    await request('http://localhost:5000')
      .post('/api/users/register')
      .send({
        name: 'Valid User',
        email: validUser.email,
        password: validUser.password,
      });
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send(validUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
  });
});
