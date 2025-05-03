// models/Resume.js
const db = require('../config/db');

const Resume = {
  upload: (user_id, file_path, original_name, callback) => {
    const sql = `
      INSERT INTO Resumes (user_id, file_path, original_filename)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [user_id, file_path, original_name], callback);
  },

  getByUserId: (user_id, callback) => {
    db.query('SELECT * FROM Resumes WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 1', [user_id], callback);
  }
  
};

module.exports = Resume;
