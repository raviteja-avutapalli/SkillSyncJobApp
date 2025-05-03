const request = require('supertest');

describe('Admin Login', () => {
  const admin = {
    email: 'admin_' + Date.now() + '@example.com',
    password: 'AdminPass123',
  };

  beforeAll(async () => {
    // Register admin with role = 'admin'
    await request('http://localhost:5000')
      .post('/api/users/register')
      .send({
        name: 'Admin Test',
        email: admin.email,
        password: admin.password,
        role: 'admin'
      });
  });

  it('should login successfully as admin', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send(admin);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
  });
});
