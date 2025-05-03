// models/Application.js
const db = require('../config/db');

const Application = {
  apply: (data, callback) => {
    const sql = `
      INSERT INTO Applications 
        (job_id, user_id, status, applied_at, resume_id, cover_letter)
      VALUES (?, ?, ?, NOW(), ?, ?)
    `;
    db.query(sql, [data.job_id, data.user_id, data.status, data.resume_id, data.cover_letter], callback);
  },

  getByUser: (user_id, callback) => {
    db.query(`
      SELECT 
        a.*, 
        j.title, j.description, j.location, j.type, j.salary_min, j.salary_max,
        j.experience_required, j.education_required, j.industry, j.remote
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = ?
      ORDER BY a.applied_at DESC;

    `, [user_id], callback);
  },
  

  getByJob: (job_id, callback) => {
    db.query(`
      SELECT a.*, u.name AS applicant_name, r.file_path
      FROM Applications a
      JOIN Users u ON a.user_id = u.id
      LEFT JOIN Resumes r ON a.resume_id = r.id
      WHERE a.job_id = ?
      ORDER BY a.applied_at DESC
    `, [job_id], callback);
  },

  updateStatus: (application_id, status, callback) => {
    db.query('UPDATE Applications SET status = ? WHERE id = ?', [status, application_id], callback);
  }
};

module.exports = Application;
