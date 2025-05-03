const request = require('supertest');

describe('User Login - Failure', () => {
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

  it('should fail to login with invalid password', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send({
        email: validUser.email,
        password: 'WrongPassword!',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
