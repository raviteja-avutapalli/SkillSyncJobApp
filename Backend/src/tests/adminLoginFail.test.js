const request = require('supertest');

describe('Admin Login - Failure', () => {
  it('should fail to login with unregistered admin email', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send({
        email: 'nonexistent_admin@example.com',
        password: 'DoesNotExist123',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
