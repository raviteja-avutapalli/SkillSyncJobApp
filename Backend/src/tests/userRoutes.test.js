const request = require('supertest');
const mongoose = require('mongoose');

let server;
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  server = require('../server'); 
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();

  if (server && server.close) {
    server.close();
  }
});
describe('User Routes', () => {
  const user = {
    name: 'test2',
    email: 't2@gmail.com',
    password: 'password',
  };

  it('should register a user', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/register')
      .send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register duplicate user', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/register')
      .send(user);
    expect(res.statusCode).toBe(400);
  });

  it('should login with valid credentials', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/users/login')
      .send({
        email: user.email,
        password: user.password,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
