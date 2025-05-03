const request = require('supertest');

describe('User Registration', () => {
  const testUser = {
    name: 'New User',
    email: 'newuser_' + Date.now() + '@example.com',
    password: 'StrongPass123',
  };

  it('should register a new user and return success message and userId', async () => {
    const response = await request('http://localhost:5000')
      .post('/api/users/register')
      .send(testUser);
      
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered');
    expect(response.body).toHaveProperty('userId');
    expect(typeof response.body.userId).toBe('number');
  });
});
