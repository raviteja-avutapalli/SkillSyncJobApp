// models/User.js
const db = require('../config/db');

const User = {
  create: (user, callback) => {
    const { name, email, password, role } = user;
    const sql = 'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, role], callback);
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM Users WHERE email = ?', [email], callback);
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM Users WHERE id = ?', [id], callback);
  },

  updatePassword: (email, newPassword, callback) => {
    db.query('UPDATE Users SET password = ? WHERE email = ?', [newPassword, email], callback);
  },
  updateName: (id, name, callback) => {
    db.query('UPDATE Users SET name = ? WHERE id = ?', [name, id], callback);
  }

};


module.exports = User;
